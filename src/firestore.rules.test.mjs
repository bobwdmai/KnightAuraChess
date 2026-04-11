import test, { before, beforeEach, after } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const PROJECT_ID = 'knightaura-rules-test';
const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

let testEnv;

async function seedGame(overrides = {}) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'games', 'game-1'), {
      whiteId: 'white-player',
      blackId: 'black-player',
      status: 'active',
      createdAt: new Date().toISOString(),
      ...overrides,
    });
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedGame();
});

after(async () => {
  await testEnv.cleanup();
});

test('game participants can update the active game document', async () => {
  const whiteDb = testEnv.authenticatedContext('white-player').firestore();

  await assertSucceeds(
    updateDoc(doc(whiteDb, 'games', 'game-1'), {
      lastMove: 'e2e4',
      updatedAt: new Date().toISOString(),
    })
  );
});

test('non-participants cannot update the game document', async () => {
  const outsiderDb = testEnv.authenticatedContext('outsider').firestore();

  await assertFails(
    updateDoc(doc(outsiderDb, 'games', 'game-1'), {
      lastMove: 'e2e4',
    })
  );
});

test('participants can write voice signaling documents', async () => {
  const blackDb = testEnv.authenticatedContext('black-player').firestore();

  await assertSucceeds(
    setDoc(doc(blackDb, 'games', 'game-1', 'voice', 'current'), {
      sessionId: 'session-1',
      callerUid: 'white-player',
      status: 'calling',
    })
  );
});

test('non-participants cannot write voice signaling documents', async () => {
  const outsiderDb = testEnv.authenticatedContext('outsider').firestore();

  await assertFails(
    setDoc(doc(outsiderDb, 'games', 'game-1', 'voice', 'current'), {
      sessionId: 'session-1',
      callerUid: 'white-player',
      status: 'calling',
    })
  );
});

test('participants can write ICE candidates inside voice sessions', async () => {
  await seedGame();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'games', 'game-1', 'voiceSessions', 'session-1'), {
      callerUid: 'white-player',
      createdAt: new Date().toISOString(),
    });
  });

  const whiteDb = testEnv.authenticatedContext('white-player').firestore();

  await assertSucceeds(
    setDoc(
      doc(whiteDb, 'games', 'game-1', 'voiceSessions', 'session-1', 'callerCandidates', 'candidate-1'),
      {
        candidate: 'candidate',
        sdpMid: '0',
        sdpMLineIndex: 0,
      }
    )
  );
});

test('unauthenticated users cannot update games', async () => {
  const anonymousDb = testEnv.unauthenticatedContext().firestore();

  await assertFails(
    updateDoc(doc(anonymousDb, 'games', 'game-1'), { lastMove: 'e2e4' })
  );
});
