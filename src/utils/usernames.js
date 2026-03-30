import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const USERNAMES_COLLECTION = 'usernames';
const MAX_DISPLAY_NAME_LENGTH = 40;
const MAX_DISPLAY_NAME_ATTEMPTS = 25;

export const USERNAME_TAKEN_ERROR = 'username-taken';
export const INVALID_USERNAME_ERROR = 'invalid-username';

const createUsernameError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export const sanitizeDisplayName = (value) =>
  `${value ?? ''}`.trim().slice(0, MAX_DISPLAY_NAME_LENGTH);

export const isValidDisplayName = (value) => {
  const displayName = sanitizeDisplayName(value);
  return Boolean(displayName) && !displayName.includes('/');
};

export const buildUsernameKey = (displayName) =>
  sanitizeDisplayName(displayName).toLowerCase();

const defaultFallbackDisplayName = (uid) => `Player-${uid.slice(0, 6)}`;

const buildCandidateDisplayName = (baseDisplayName, uid, attempt) => {
  const base = sanitizeDisplayName(baseDisplayName) || defaultFallbackDisplayName(uid);
  if (attempt === 0) return base;

  const suffix = attempt === 1 ? uid.slice(0, 4) : `${uid.slice(0, 4)}${attempt}`;
  const maxBaseLength = Math.max(1, MAX_DISPLAY_NAME_LENGTH - suffix.length - 1);
  return `${base.slice(0, maxBaseLength).trimEnd()}-${suffix}`;
};

const reserveDisplayName = async ({
  db,
  uid,
  displayName,
  previousUsernameKey = null,
  profilePatch = {}
}) => {
  const usernameKey = buildUsernameKey(displayName);
  const userRef = doc(db, USERS_COLLECTION, uid);
  const usernameRef = doc(db, USERNAMES_COLLECTION, usernameKey);

  await runTransaction(db, async (tx) => {
    const usernameSnap = await tx.get(usernameRef);
    if (usernameSnap.exists() && usernameSnap.data()?.uid !== uid) {
      throw createUsernameError(USERNAME_TAKEN_ERROR, 'Username already taken.');
    }

    if (previousUsernameKey && previousUsernameKey !== usernameKey) {
      const previousRef = doc(db, USERNAMES_COLLECTION, previousUsernameKey);
      const previousSnap = await tx.get(previousRef);
      if (previousSnap.exists() && previousSnap.data()?.uid === uid) {
        tx.delete(previousRef);
      }
    }

    const usernamePatch = {
      uid,
      displayName,
      updatedAt: serverTimestamp()
    };
    if (!usernameSnap.exists()) {
      usernamePatch.createdAt = serverTimestamp();
    }

    tx.set(usernameRef, usernamePatch, { merge: true });
    tx.set(userRef, {
      ...profilePatch,
      displayName,
      usernameKey,
      updatedAt: serverTimestamp()
    }, { merge: true });
  });

  return { displayName, usernameKey };
};

export async function claimDisplayName({
  db,
  uid,
  desiredDisplayName,
  previousUsernameKey = null,
  profilePatch = {}
}) {
  const displayName = sanitizeDisplayName(desiredDisplayName);
  if (!isValidDisplayName(displayName)) {
    throw createUsernameError(
      INVALID_USERNAME_ERROR,
      'Username must be non-empty and cannot contain "/".'
    );
  }

  return reserveDisplayName({
    db,
    uid,
    displayName,
    previousUsernameKey,
    profilePatch
  });
}

export async function ensureUniqueDisplayName({
  db,
  uid,
  desiredDisplayName,
  fallbackDisplayName = null,
  previousUsernameKey = null,
  profilePatch = {}
}) {
  const safeFallback = isValidDisplayName(fallbackDisplayName)
    ? sanitizeDisplayName(fallbackDisplayName)
    : defaultFallbackDisplayName(uid);
  const baseDisplayName = isValidDisplayName(desiredDisplayName)
    ? sanitizeDisplayName(desiredDisplayName)
    : safeFallback;

  for (let attempt = 0; attempt < MAX_DISPLAY_NAME_ATTEMPTS; attempt += 1) {
    const candidateDisplayName = buildCandidateDisplayName(baseDisplayName, uid, attempt);
    try {
      return await reserveDisplayName({
        db,
        uid,
        displayName: candidateDisplayName,
        previousUsernameKey,
        profilePatch
      });
    } catch (error) {
      if (error?.code !== USERNAME_TAKEN_ERROR) {
        throw error;
      }
    }
  }

  throw new Error('Unable to reserve a unique username right now.');
}

export async function hasMatchingUsernameClaim({ db, uid, usernameKey, displayName }) {
  if (!usernameKey || !isValidDisplayName(displayName)) {
    return false;
  }

  if (usernameKey !== buildUsernameKey(displayName)) {
    return false;
  }

  const usernameSnap = await getDoc(doc(db, USERNAMES_COLLECTION, usernameKey));
  if (!usernameSnap.exists()) {
    return false;
  }

  const data = usernameSnap.data() || {};
  return data.uid === uid && data.displayName === sanitizeDisplayName(displayName);
}
