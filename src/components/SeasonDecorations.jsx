import React, { useEffect, useMemo, useState } from 'react';

const getSeason = (date = new Date()) => {
  const month = date.getMonth();
  if (month === 11 || month <= 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
};

const DECORATION_MAP = {
  winter: { icon: '❄', count: 16, label: 'Winter' },
  spring: { icon: '✿', count: 14, label: 'Spring' },
  summer: { icon: '✦', count: 12, label: 'Summer' },
  autumn: { icon: '❋', count: 14, label: 'Autumn' },
};

export default function SeasonDecorations() {
  const season = getSeason();
  const config = DECORATION_MAP[season];
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const items = useMemo(
    () => Array.from({ length: config.count }, (_, index) => ({
      id: `${season}-${index}`,
      left: `${(index * 97) % 100}%`,
      delay: `${(index % 7) * 0.8}s`,
      duration: `${8 + (index % 5) * 1.4}s`,
      scale: 0.7 + (index % 4) * 0.14,
      drift: `${((index % 5) - 2) * 22}px`,
    })),
    [config.count, season]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncCursorCapability = () => {
      setCursorEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    syncCursorCapability();
    pointerQuery.addEventListener?.('change', syncCursorCapability);
    motionQuery.addEventListener?.('change', syncCursorCapability);

    return () => {
      pointerQuery.removeEventListener?.('change', syncCursorCapability);
      motionQuery.removeEventListener?.('change', syncCursorCapability);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    document.body.classList.toggle('season-cursor-active', cursorEnabled);
    return () => {
      document.body.classList.remove('season-cursor-active');
    };
  }, [cursorEnabled]);

  useEffect(() => {
    if (!cursorEnabled || typeof window === 'undefined') return undefined;

    const handlePointerMove = (event) => {
      setCursorVisible(true);
      setCursorPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handlePointerLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [cursorEnabled]);

  return (
    <div className={`season-decor season-decor--${season}`} aria-hidden="true" data-season={config.label}>
      {cursorEnabled && (
        <span
          className={`season-decor__cursor${cursorVisible ? ' season-decor__cursor--visible' : ''}`}
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
          }}
        >
          {config.icon}
        </span>
      )}
      {items.map((item) => (
        <span
          key={item.id}
          className="season-decor__item"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            '--season-scale': item.scale,
            '--season-drift': item.drift,
          }}
        >
          {config.icon}
        </span>
      ))}
    </div>
  );
}
