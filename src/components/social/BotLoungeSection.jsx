import React, { useEffect, useMemo, useState } from 'react';
import { getBotPersona, requestTextAiReply } from '../../utils/textAi.js';

const BOT_LAUNCHER_BOTS = [
  { uid: 'bot_alex_kim', name: 'Alex Kim' },
  { uid: 'bot_jordan_park', name: 'Jordan Park' },
  { uid: 'bot_morgan_chen', name: 'Morgan Chen' },
  { uid: 'bot_casey_lee', name: 'Casey Lee' },
  { uid: 'bot_riley_wang', name: 'Riley Wang' },
  { uid: 'bot_taylor_singh', name: 'Taylor Singh' },
];

const STORAGE_KEY = 'cr_bot_lounge_messages';

function loadMessages() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export default function BotLoungeSection() {
  const [messages, setMessages] = useState(() => loadMessages());

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    let active = true;
    const tick = async () => {
      const speaker = BOT_LAUNCHER_BOTS[Math.floor(Math.random() * BOT_LAUNCHER_BOTS.length)];
      const listener = BOT_LAUNCHER_BOTS[Math.floor(Math.random() * BOT_LAUNCHER_BOTS.length)];
      if (speaker.uid === listener.uid) return;

      const speakerPersona = getBotPersona(speaker.uid, speaker.name);
      const listenerPersona = getBotPersona(listener.uid, listener.name);
      const prompt = [
        { role: 'system', content: `You are ${speakerPersona.name}, talking to ${listenerPersona.name} in a lobby chat.` },
        { role: 'user', content: 'Send one short, natural message to another bot in the lobby. Stay casual and chess-related if possible.' },
      ];

      try {
        const text = await requestTextAiReply({
          history: prompt,
          personaName: speakerPersona.name,
          personaAge: speakerPersona.age,
          personaStyle: speakerPersona.style,
        });
        if (!active) return;
        setMessages((prev) => [
          ...prev.slice(-19),
          {
            id: `${Date.now()}-${speaker.uid}`,
            speaker: speaker.name,
            listener: listener.name,
            text,
            createdAt: Date.now(),
          },
        ]);
      } catch {
        // quiet fallback
      }
    };

    const run = async () => {
      while (active) {
        await new Promise((resolve) => setTimeout(resolve, 30000 + Math.floor(Math.random() * 30000)));
        if (!active) break;
        await tick();
      }
    };

    run();
    return () => {
      active = false;
    };
  }, []);

  const visibleMessages = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <div className="social-section">
      <h4 className="social-section-title">Bot Lounge</h4>
      <p className="muted">Bot chatter between games.</p>
      <div className="announcements-list">
        {visibleMessages.length === 0 && <p className="muted">No chatter yet.</p>}
        {visibleMessages.map((msg) => (
          <div key={msg.id} className="ann-item">
            <div className="ann-row">
              <span className="ann-author">{msg.speaker} → {msg.listener}</span>
            </div>
            <p className="ann-text">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
