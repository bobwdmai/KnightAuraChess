import { describe, expect, it, vi, afterEach } from 'vitest';
import { requestTextAiReply } from './textAi.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('requestTextAiReply', () => {
  it('falls back to an offline bot reply when the AI endpoint is unavailable', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const reply = await requestTextAiReply({
      history: [{ role: 'user', content: 'The board feels crowded tonight.' }],
      personaName: 'Alex Kim',
      personaStyle: 'witty/playful',
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(reply).toBeTruthy();
    expect(reply).not.toMatch(/ollama/i);
  });
});
