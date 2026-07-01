const DEFAULT_SPREADSHEET_ID = '1GckEpaMGLECyS0AmGTibt8FIhSu4GF8S3Lg5iyKwND4';
const DEFAULT_RANGE = 'A:P';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

const HEADERS = [
  'id',
  'title',
  'description',
  'fen',
  'solution',
  'solutionMoves',
  'hint',
  'tags',
  'authorId',
  'authorName',
  'featured',
  'status',
  'createdAt',
  'updatedAt',
  'ratingTotal',
  'ratingCount',
];

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

function base64UrlEncode(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

async function createGoogleJwt(env) {
  const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets service account is not configured.');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned)
  );
  return `${unsigned}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function getAccessToken(env) {
  const assertion = await createGoogleJwt(env);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error_description || data?.error || 'Google auth failed.');
  }
  return data.access_token;
}

function getConfig(env) {
  return {
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID,
    range: env.GOOGLE_SHEETS_PUZZLES_RANGE || DEFAULT_RANGE,
  };
}

function parseJsonList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value).split(',').map((entry) => entry.trim()).filter(Boolean);
  }
}

function rowToPuzzle(row) {
  const [
    id,
    title,
    description,
    fen,
    solution,
    solutionMoves,
    hint,
    tags,
    authorId,
    authorName,
    featured,
    status,
    createdAt,
    updatedAt,
    ratingTotal,
    ratingCount,
  ] = row;

  if (!id || !title || !fen) return null;

  const total = Number(ratingTotal || 0);
  const count = Number(ratingCount || 0);
  return {
    id,
    title,
    description: description || '',
    fen,
    solution: solution || '',
    solutionMoves: parseJsonList(solutionMoves),
    hint: hint || '',
    tags: parseJsonList(tags),
    authorId: authorId || 'sheet',
    authorName: authorName || 'Community',
    featured: featured === 'true',
    status: status || 'approved',
    createdAt: Number(createdAt || Date.now()),
    updatedAt: Number(updatedAt || createdAt || Date.now()),
    ratingTotal: Number.isFinite(total) ? total : 0,
    ratingCount: Number.isFinite(count) ? count : 0,
  };
}

function normalizeTags(tags) {
  const raw = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return raw.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean).slice(0, 5);
}

function sanitizePuzzle(input) {
  const title = String(input?.title || '').trim().slice(0, 80);
  const description = String(input?.description || '').trim().slice(0, 240);
  const fen = String(input?.fen || '').trim().slice(0, 140);
  const solution = String(input?.solution || '').trim().slice(0, 24);
  const solutionMoves = Array.isArray(input?.solutionMoves)
    ? input.solutionMoves.map((move) => String(move).trim()).filter(Boolean).slice(0, 20)
    : [];
  const hint = String(input?.hint || '').trim().slice(0, 120);
  const tags = normalizeTags(input?.tags);
  const authorId = String(input?.authorId || 'sheet').trim().slice(0, 96);
  const authorName = String(input?.authorName || 'Community creator').trim().slice(0, 80);

  if (!title) throw new Error('Add a title.');
  if (!fen) throw new Error('Add a board position.');
  if (!solution || solutionMoves.length === 0) throw new Error('Add at least one solution move.');

  const now = Date.now();
  return {
    id: `sheet-${now}-${crypto.randomUUID().slice(0, 8)}`,
    title,
    description,
    fen,
    solution,
    solutionMoves,
    hint,
    tags,
    authorId,
    authorName,
    featured: false,
    status: 'approved',
    createdAt: now,
    updatedAt: now,
    ratingTotal: 0,
    ratingCount: 0,
  };
}

async function sheetsFetch(env, path, init = {}) {
  const token = await getAccessToken(env);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Google Sheets request failed.');
  }
  return data;
}

async function ensureHeader(env, config) {
  const encodedRange = encodeURIComponent(config.range);
  const data = await sheetsFetch(env, `${config.spreadsheetId}/values/${encodedRange}`);
  const rows = data.values || [];
  const firstRow = rows[0] || [];
  if (firstRow[0] === 'id' && firstRow[1] === 'title') return rows;

  await sheetsFetch(
    env,
    `${config.spreadsheetId}/values/${encodedRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      body: JSON.stringify({ values: [HEADERS] }),
    }
  );
  return [HEADERS, ...rows];
}

async function handleGet(env) {
  const config = getConfig(env);
  const rows = await ensureHeader(env, config);
  const dataRows = rows[0]?.[0] === 'id' ? rows.slice(1) : rows;
  const puzzles = dataRows
    .map(rowToPuzzle)
    .filter(Boolean)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  return json({ puzzles, source: 'google-sheets' });
}

async function handlePost(request, env) {
  const config = getConfig(env);
  await ensureHeader(env, config);
  const input = await request.json().catch(() => ({}));
  const puzzle = sanitizePuzzle(input);
  const row = [
    puzzle.id,
    puzzle.title,
    puzzle.description,
    puzzle.fen,
    puzzle.solution,
    JSON.stringify(puzzle.solutionMoves),
    puzzle.hint,
    JSON.stringify(puzzle.tags),
    puzzle.authorId,
    puzzle.authorName,
    String(puzzle.featured),
    puzzle.status,
    String(puzzle.createdAt),
    String(puzzle.updatedAt),
    String(puzzle.ratingTotal),
    String(puzzle.ratingCount),
  ];

  await sheetsFetch(
    env,
    `${config.spreadsheetId}/values/${encodeURIComponent(config.range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      body: JSON.stringify({ values: [row] }),
    }
  );

  return json({ puzzle }, 201);
}

export async function onRequest({ request, env }) {
  try {
    if (request.method === 'GET') return await handleGet(env);
    if (request.method === 'POST') return await handlePost(request, env);
    return json({ error: 'Method not allowed.' }, 405);
  } catch (error) {
    return json({ error: error?.message || 'Community puzzle storage failed.' }, 500);
  }
}
