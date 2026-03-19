import React from 'react';
import './LearnPage.css';

/**
 * Build the Knight Aura grid (9×9, knight at center e5 = [4,4]).
 * Adjacent squares (8 king-move squares) + Knight-reachable squares (up to 8).
 */
function buildAuraGrid() {
  const SIZE = 9;
  const knightR = 4, knightC = 4;
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));

  // Adjacent squares (king-move pattern: 1 step any direction)
  const adj = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (const [dr, dc] of adj) {
    const r = knightR + dr, c = knightC + dc;
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) grid[r][c] = 'adj';
  }

  // Knight-move squares (L-shape jumps)
  const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of knightMoves) {
    const r = knightR + dr, c = knightC + dc;
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) grid[r][c] = 'knight';
  }

  grid[knightR][knightC] = 'N'; // The knight itself
  return grid;
}

const auraGrid = buildAuraGrid();

export default function LearnPage({ onBack }) {
  return (
    <div className="learn-page">
      {/* ── Header ── */}
      <header className="learn-page-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back to Game
        </button>
        <div className="learn-page-title">
          <h1>♞ How to Play KNightAuraChess</h1>
          <p>Standard chess — supercharged by knight proximity</p>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="learn-hero">
        <div className="learn-hero-text">
          <h2>The Knight Changes Everything</h2>
          <p>
            In KNightAuraChess, pieces near a friendly knight gain the power to
            <strong> jump over one blocking piece</strong>. This opens up
            surprise tactics and deeper strategic play.
          </p>
        </div>
      </section>

      {/* ── Rule 1: The Aura ── */}
      <section className="learn-section learn-section--green">
        <div className="learn-section-badge">1</div>
        <div className="learn-section-body">
          <h3>The Knight Aura Zone</h3>
          <p className="learn-section-subtitle">Proximity is power</p>
          <p>
            Any friendly piece that is <strong>adjacent</strong> to a knight (all 8 surrounding
            squares) <em>or</em> on a square <strong>reachable by a knight's L-shaped move</strong> gains
            the ability to jump. That's up to <strong>16 squares</strong> of influence.
          </p>

          <div className="learn-aura-grid-wrapper">
            <div className="learn-aura-grid">
              {auraGrid.map((row, ri) => (
                <div key={ri} className="learn-aura-row">
                  {row.map((cell, ci) => {
                    let cls = 'learn-aura-cell';
                    let content = '';
                    if (cell === 'N') {
                      cls += ' learn-aura-cell--knight';
                      content = '♞';
                    } else if (cell === 'adj') {
                      cls += ' learn-aura-cell--adjacent';
                      content = '★';
                    } else if (cell === 'knight') {
                      cls += ' learn-aura-cell--knight-move';
                      content = '✦';
                    }
                    return (
                      <div key={ci} className={cls}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="learn-aura-legend">
              <span className="learn-legend-item">
                <span className="learn-legend-swatch learn-legend--knight">♞</span> Knight
              </span>
              <span className="learn-legend-item">
                <span className="learn-legend-swatch learn-legend--adj">★</span> Adjacent (8)
              </span>
              <span className="learn-legend-item">
                <span className="learn-legend-swatch learn-legend--knm">✦</span> Knight-move (8)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rule 2: Jumping ── */}
      <section className="learn-section learn-section--blue">
        <div className="learn-section-badge">2</div>
        <div className="learn-section-body">
          <h3>Jump Exactly One Blocker</h3>
          <p className="learn-section-subtitle">Leap over a single piece</p>
          <p>
            A piece inside the knight's aura can jump over <strong>exactly one</strong> blocking
            piece along its normal movement path, then keep sliding. It may capture
            after the jump.
          </p>
          <div className="learn-jump-demo">
            <div className="learn-jump-track">
              <div className="learn-jump-cell learn-jump-cell--piece">♖</div>
              <div className="learn-jump-cell learn-jump-cell--empty"></div>
              <div className="learn-jump-cell learn-jump-cell--blocker">♟</div>
              <div className="learn-jump-cell learn-jump-cell--land">○</div>
              <div className="learn-jump-cell learn-jump-cell--land">○</div>
              <div className="learn-jump-cell learn-jump-cell--capture">♝</div>
            </div>
            <div className="learn-jump-arrow">
              <span>♖ jumps over ♟ → lands on ○ or captures ♝</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rule 3: Second Blocker ── */}
      <section className="learn-section learn-section--red">
        <div className="learn-section-badge">3</div>
        <div className="learn-section-body">
          <h3>Second Blocker Stops You</h3>
          <p className="learn-section-subtitle">Only one jump per move</p>
          <p>
            After jumping one piece, the <strong>next piece</strong> on that line blocks further
            travel. You cannot jump twice in a single move.
          </p>
          <div className="learn-jump-demo">
            <div className="learn-jump-track">
              <div className="learn-jump-cell learn-jump-cell--piece">♕</div>
              <div className="learn-jump-cell learn-jump-cell--empty"></div>
              <div className="learn-jump-cell learn-jump-cell--blocker">♟</div>
              <div className="learn-jump-cell learn-jump-cell--land">○</div>
              <div className="learn-jump-cell learn-jump-cell--blocked">♜</div>
              <div className="learn-jump-cell learn-jump-cell--nogo">✗</div>
            </div>
            <div className="learn-jump-arrow">
              <span>♕ jumps ♟ but ♜ stops further travel — cannot pass ♜</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rule 4: Pawns & Kings ── */}
      <section className="learn-section learn-section--green">
        <div className="learn-section-badge">4</div>
        <div className="learn-section-body">
          <h3>Pawns & Kings Jump Too</h3>
          <p className="learn-section-subtitle">Short-range jumps</p>
          <p>
            <strong>Pawns</strong> near a knight can jump one square forward over a blocker.
            <strong> Kings</strong> can jump one square in any direction when blocked —
            as long as the landing square is safe.
          </p>
          <div className="learn-jump-demo">
            <div className="learn-jump-mini">
              <div className="learn-jump-col">
                <div className="learn-jump-cell learn-jump-cell--land">○</div>
                <div className="learn-jump-cell learn-jump-cell--blocker">♟</div>
                <div className="learn-jump-cell learn-jump-cell--piece">♙</div>
                <div className="learn-jump-cell learn-jump-cell--knight-src">♞</div>
              </div>
              <span className="learn-jump-col-label">Pawn jumps ♟ (powered by ♞)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Summary ── */}
      <section className="learn-summary">
        <h3>Quick Reference</h3>
        <div className="learn-summary-grid">
          <div className="learn-summary-card">
            <span className="learn-summary-icon">♞</span>
            <strong>Aura</strong>
            <p>8 adjacent + 8 knight-move = 16 squares of influence</p>
          </div>
          <div className="learn-summary-card">
            <span className="learn-summary-icon">⤴</span>
            <strong>Jump</strong>
            <p>Leap over exactly one blocker along normal move path</p>
          </div>
          <div className="learn-summary-card">
            <span className="learn-summary-icon">🛑</span>
            <strong>Limit</strong>
            <p>Second blocker stops you — one jump per move only</p>
          </div>
        </div>
      </section>

      <footer className="learn-page-footer">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back to Game
        </button>
      </footer>
    </div>
  );
}
