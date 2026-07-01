const PUZZLES_API_URL = '/api/community-puzzles';

export async function fetchCommunityPuzzlesFromSheet() {
  const response = await fetch(PUZZLES_API_URL, {
    headers: { Accept: 'application/json' },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'Could not load community puzzles.');
  }
  return Array.isArray(payload.puzzles) ? payload.puzzles : [];
}

export async function publishCommunityPuzzleToSheet(puzzle) {
  const response = await fetch(PUZZLES_API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(puzzle),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'Could not publish puzzle.');
  }
  return payload.puzzle;
}
