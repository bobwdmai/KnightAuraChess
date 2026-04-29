import React from 'react';
import './LearnPage.css';

function buildAuraGrid() {
  const SIZE = 9;
  const knightR = 4;
  const knightC = 4;
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const adj = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (const [dr, dc] of adj) {
    const r = knightR + dr;
    const c = knightC + dc;
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) grid[r][c] = 'adj';
  }
  const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of knightMoves) {
    const r = knightR + dr;
    const c = knightC + dc;
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) grid[r][c] = 'knight';
  }
  grid[knightR][knightC] = 'N';
  return grid;
}

const auraGrid = buildAuraGrid();

const ruleMapSections = [
  {
    number: '1',
    tone: 'green',
    title: 'Aura Source',
    subtitle: 'Knights create the rule twist.',
    copy: 'A knight projects aura to nearby friendly pieces. The knight is the source; the pieces around it are the ones that gain the jump.',
    diagram: {
      rows: [
        [
          { text: '♗', kind: 'empowered', label: 'empowered bishop on touching corner' },
          { text: '♖', kind: 'empowered', label: 'empowered rook' },
          { text: '♕', kind: 'empowered', label: 'empowered queen on touching corner' },
        ],
        [
          { text: '♙', kind: 'empowered', label: 'empowered pawn' },
          { text: '♘', kind: 'source', label: 'aura source knight' },
          { text: '♔', kind: 'empowered', label: 'empowered king' },
        ],
        [
          { text: '♙', kind: 'empowered', label: 'empowered pawn on touching corner' },
          { text: '♗', kind: 'empowered', label: 'empowered bishop' },
          { text: '♖', kind: 'empowered', label: 'empowered rook on touching corner' },
        ],
      ],
      note: 'All 8 touching squares are aura squares, including the corners.',
    },
  },
  {
    number: '2',
    tone: 'blue',
    title: 'Empowered Squares',
    subtitle: 'Touch the knight, or sit where the knight could jump.',
    copy: 'A friendly piece is empowered if it touches your knight or sits on a square your knight could jump to.',
    diagram: 'aura',
  },
  {
    number: '3',
    tone: 'green',
    title: 'Legal Jump',
    subtitle: 'Move normally, then clear the first blocker.',
    copy: 'An empowered piece moves on its normal line, but may clear the first blocker on that path and land beyond it.',
    diagram: {
      rows: [
        [
          { text: '♘', kind: 'source', label: 'aura source knight' },
          { text: '♖', kind: 'empowered', label: 'empowered rook' },
          { text: '→', kind: 'path', label: 'movement path' },
          { text: '♟', kind: 'blocker', label: 'blocker' },
          { text: '○', kind: 'legal', label: 'legal landing square' },
          { text: '♝', kind: 'legal', label: 'legal capture square' },
        ],
      ],
      note: 'The rook is empowered, clears one blocker, then may stop or capture beyond it.',
    },
  },
  {
    number: '4',
    tone: 'red',
    title: 'Hard Limits',
    subtitle: 'Aura changes movement, not every chess rule.',
    copy: 'Only one blocker can be jumped. Pawns do not capture straight forward, but aura can create diagonal jump captures.',
    diagram: [
      {
        title: 'One jump only',
        rows: [
          [
            { text: '♘', kind: 'source', label: 'aura source knight' },
            { text: '♕', kind: 'empowered', label: 'empowered queen' },
            { text: '→', kind: 'path', label: 'movement path' },
            { text: '♟', kind: 'blocker', label: 'first blocker' },
            { text: '○', kind: 'legal', label: 'legal landing square after first blocker' },
            { text: '♟', kind: 'blocker', label: 'second blocker' },
            { text: '✕', kind: 'illegal', label: 'illegal square beyond second blocker' },
          ],
        ],
        note: 'After clearing the first blocker, the next occupied square stops the line.',
      },
      {
        title: 'Pawn landing rule',
        kind: 'pawn-grid',
        cases: [
          {
            caption: 'Forward jump · empty landing',
            verdict: 'legal',
            grid: [
              [{ kind: 'land-legal', text: '○', label: 'empty landing square' }, null, null],
              [{ kind: 'blocker', text: '♟', label: 'blocker jumped over' }, null, null],
              [{ kind: 'pawn', text: '♙', label: 'empowered pawn' }, null, null],
            ],
          },
          {
            caption: 'Forward jump · onto a piece',
            verdict: 'illegal',
            grid: [
              [{ kind: 'land-illegal', text: '♜', label: 'illegal forward capture' }, null, null],
              [{ kind: 'blocker', text: '♟', label: 'blocker jumped over' }, null, null],
              [{ kind: 'pawn', text: '♙', label: 'empowered pawn' }, null, null],
            ],
          },
          {
            caption: 'Diagonal jump · capture black rook',
            verdict: 'legal',
            grid: [
              [null, null, { kind: 'capture', text: '♜', label: 'black rook captured diagonally' }],
              [null, { kind: 'blocker', text: '♝', label: 'black bishop jumped over diagonally' }, null],
              [{ kind: 'pawn', text: '♙', label: 'empowered pawn' }, null, null],
            ],
          },
        ],
        note: 'Forward pawn jumps require an empty landing square. Captures still happen diagonally.',
      },
    ],
  },
];

function LearnDiagram({ diagram }) {
  if (diagram === 'aura') {
    return (
      <div className="learn-aura-grid-wrapper">
        <div className="learn-aura-grid" aria-label="Empowered aura squares diagram">
          {auraGrid.map((row, ri) => (
            <div key={ri} className="learn-aura-row">
              {row.map((cell, ci) => {
                let cls = 'learn-aura-cell';
                let content = '';
                if (cell === 'N') {
                  cls += ' learn-aura-cell--knight';
                  content = '♘';
                } else if (cell === 'adj') {
                  cls += ' learn-aura-cell--adjacent';
                  content = '★';
                } else if (cell === 'knight') {
                  cls += ' learn-aura-cell--knight-move';
                  content = '✦';
                }
                return <div key={ci} className={cls}>{content}</div>;
              })}
            </div>
          ))}
        </div>
        <div className="learn-aura-legend">
          <span className="learn-legend-item"><span className="learn-legend-swatch learn-legend--knight">♘</span> Aura source</span>
          <span className="learn-legend-item"><span className="learn-legend-swatch learn-legend--adj">★</span> Adjacent</span>
          <span className="learn-legend-item"><span className="learn-legend-swatch learn-legend--knm">✦</span> Knight-move square</span>
        </div>
      </div>
    );
  }

  const diagrams = Array.isArray(diagram) ? diagram : [diagram];

  return (
    <div className={diagrams.length > 1 ? 'learn-rule-diagram-list' : 'learn-rule-diagram'}>
      {diagrams.map((item) => (
        <div key={item.title || item.note} className="learn-rule-diagram">
          {item.title && <strong className="learn-rule-diagram-title">{item.title}</strong>}
          {item.kind === 'pawn-grid' ? (
            <div className="learn-pawn-cases" aria-label={item.note}>
              {item.cases.map((c) => (
                <div
                  key={c.caption}
                  className={`learn-pawn-case learn-pawn-case--${c.verdict}`}
                >
                  <div className="learn-pawn-grid">
                    {c.grid.map((row, ri) => (
                      <div key={ri} className="learn-pawn-grid-row">
                        {row.map((cell, ci) => (
                          <div
                            key={`${ri}-${ci}`}
                            className={`learn-pawn-cell${cell ? ` learn-pawn-cell--${cell.kind}` : ''}`}
                            aria-label={cell?.label || 'empty square'}
                          >
                            {cell?.text || ''}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <span className={`learn-pawn-verdict learn-pawn-verdict--${c.verdict}`}>
                    {c.verdict === 'legal' ? '✓' : '✕'} {c.caption}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="learn-rule-board" aria-label={item.note}>
              {item.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="learn-rule-row">
                  {row.map((cell, cellIndex) => (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      className={`learn-rule-cell learn-rule-cell--${cell.kind}`}
                      aria-label={cell.label || 'empty square'}
                    >
                      {cell.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <p>{item.note}</p>
        </div>
      ))}
    </div>
  );
}

function RuleMapSection({ section }) {
  return (
    <section className={`learn-section learn-section--${section.tone}`}>
      <div className="learn-section-badge">{section.number}</div>
      <div className="learn-section-body">
        <h3>{section.title}</h3>
        <p className="learn-section-subtitle">{section.subtitle}</p>
        <p>{section.copy}</p>
        <LearnDiagram diagram={section.diagram} />
      </div>
    </section>
  );
}

export default function LearnPage({ onBack }) {
  return (
    <div className="learn-page">
      <header className="learn-page-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back to Game
        </button>
        <div className="learn-page-title">
          <h1>♘ How to Play Knight-Aura Chess</h1>
          <p>One guide for aura squares, legal jumps, and movement limits</p>
        </div>
      </header>

      <section className="learn-hero">
        <div className="learn-hero-text">
          <h2>Learn the one rule twist, then practice it</h2>
          <p>
            White knights empower nearby white pieces to <strong>jump one blocker</strong>.
            Black pieces in these examples are blockers or targets. Use the rule map below
            as the complete reference for legal aura movement.
          </p>
        </div>
      </section>

      <div className="learn-rule-map" aria-label="Knight-Aura rule map">
        {ruleMapSections.map((section) => (
          <RuleMapSection key={section.title} section={section} />
        ))}
      </div>

      <section className="learn-summary">
        <h3>Quick Reference</h3>
        <div className="learn-summary-grid">
          <div className="learn-summary-card">
            <span className="learn-summary-icon">♘</span>
            <strong>The Aura</strong>
            <p>Touch the knight or sit where the knight could jump</p>
          </div>
          <div className="learn-summary-card">
            <span className="learn-summary-icon">⤴</span>
            <strong>The Jump</strong>
            <p>Clear the first blocker on the piece&apos;s normal path</p>
          </div>
          <div className="learn-summary-card">
            <span className="learn-summary-icon">🛑</span>
            <strong>The Limit</strong>
            <p>Second blockers, pawn captures, and king safety still matter</p>
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
