import { useEffect, useMemo, useState } from 'react';

export const BOARD_HAND_TRAVEL_MS = 780;
export const BOARD_HAND_SETTLE_MS = 80;
export const BOARD_HAND_CAPTURE_THROW_DELAY_MS = 800;
export const BOARD_HAND_CAPTURE_THROW_MS = 580;
export const BOARD_HAND_TOTAL_MS = BOARD_HAND_TRAVEL_MS + BOARD_HAND_SETTLE_MS;
export const BOARD_HAND_CAPTURE_TOTAL_MS =
  BOARD_HAND_CAPTURE_THROW_DELAY_MS + BOARD_HAND_CAPTURE_THROW_MS + BOARD_HAND_SETTLE_MS;

const easeInOutCubic = (value) => (
  value < 0.5
    ? 4 * value ** 3
    : 1 - ((-2 * value + 2) ** 3) / 2
);

export function useBoardHandAnimation({ enabled, is3D, moveAnimation, moveFromCenter, moveToCenter }) {
  const [moveOverlayActive, setMoveOverlayActive] = useState(false);
  const [moveProgress, setMoveProgress] = useState(0);
  const [movePlaced, setMovePlaced] = useState(false);

  useEffect(() => {
    if (!(enabled && moveAnimation && moveFromCenter && moveToCenter)) {
      setMoveOverlayActive(false);
      setMoveProgress(0);
      setMovePlaced(false);
      return undefined;
    }

    setMoveOverlayActive(false);
    setMoveProgress(0);
    setMovePlaced(false);

    let frame = 0;
    let start = 0;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const computedStyle = getComputedStyle(document.body);
      const rawMoveStr = computedStyle.getPropertyValue('--anim-duration-move').trim();
      let travelMs = BOARD_HAND_TRAVEL_MS;
      if (rawMoveStr) {
        travelMs = rawMoveStr.endsWith('ms') ? parseFloat(rawMoveStr) : parseFloat(rawMoveStr) * 1000;
      }
      const rawSettleStr = computedStyle.getPropertyValue('--anim-duration-settle').trim();
      let settleMs = BOARD_HAND_SETTLE_MS;
      if (rawSettleStr) {
        settleMs = rawSettleStr.endsWith('ms') ? parseFloat(rawSettleStr) : parseFloat(rawSettleStr) * 1000;
      }
      
      const totalMs = travelMs + settleMs;
      const effectiveTravelMs = travelMs > 0 ? travelMs : 1; // Prevent division by zero
      const travelProgress = Math.min(elapsed / effectiveTravelMs, 1);
      
      setMoveProgress(travelProgress);
      setMovePlaced(elapsed >= totalMs);
      if (elapsed < totalMs && travelMs > 0) {
        frame = requestAnimationFrame(tick);
      } else if (travelMs === 0) {
        // If reduced motion / 0 duration is configured, fast-forward logic
        setMoveProgress(1);
        setMovePlaced(true);
      }
    };

    frame = requestAnimationFrame((timestamp) => {
      setMoveOverlayActive(true);
      tick(timestamp);
    });

    return () => cancelAnimationFrame(frame);
  }, [enabled, moveAnimation, moveFromCenter, moveToCenter]);

  const currentMoveCenter = useMemo(() => {
    if (!moveFromCenter || !moveToCenter) return null;

    const startX = Number.parseFloat(moveFromCenter.x);
    const startY = Number.parseFloat(moveFromCenter.y);
    const endX = Number.parseFloat(moveToCenter.x);
    const endY = Number.parseFloat(moveToCenter.y);
    const eased = easeInOutCubic(moveProgress);
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.hypot(dx, dy) || 1;
    const sway = is3D ? Math.sin(eased * Math.PI) * Math.min(distance * 0.01, 0.28) : 0;
    const offsetX = is3D ? (-dy / distance) * sway : 0;
    const offsetY = is3D ? (dx / distance) * sway : 0;
    const lead = is3D ? Math.sin(eased * Math.PI) * Math.min(distance * 0.018, 0.3) : 0;
    const leadX = is3D ? (dx / distance) * lead : 0;
    const leadY = is3D ? (dy / distance) * lead : 0;

    return {
      x: `${startX + dx * eased + offsetX + leadX}%`,
      y: `${startY + dy * eased + offsetY + leadY}%`,
      handTilt: is3D ? -12 + eased * 14 : 0,
      pieceTilt: 0,
      pieceScale: 1,
      gripX: is3D ? `${-5 + lead * 4}px` : '0px',
      gripY: '0px',
      lift: 0,
    };
  }, [moveFromCenter, moveProgress, moveToCenter, is3D]);

  return {
    moveOverlayActive,
    movePlaced,
    currentMoveCenter,
  };
}
