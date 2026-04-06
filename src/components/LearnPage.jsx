import React, { useMemo, useState } from 'react';
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

const interactiveLessons = [
  {
    title: 'Aura Builder',
    tag: 'Basics',
    goal: 'Learn which squares gain jumping power from a knight.',
    steps: [
      {
        title: 'Center the knight',
        note: 'A central knight spreads the widest useful aura.',
        board: [
          ['','','','','','',''],
          ['','','','','','',''],
          ['','','','','','',''],
          ['','','','♞','','',''],
          ['','','','','','',''],
          ['','','','','','',''],
          ['','','','','','',''],
        ],
      },
      {
        title: 'Adjacent allies are empowered',
        note: 'Every square touching the knight is inside the aura.',
        board: [
          ['','','','','','',''],
          ['','','','','','',''],
          ['','','★','★','★','',''],
          ['','','★','♞','★','',''],
          ['','','★','★','★','',''],
          ['','','','','','',''],
          ['','','','','','',''],
        ],
      },
      {
        title: 'Knight jumps count too',
        note: 'L-shaped reach also grants the aura, for up to 16 empowered squares total.',
        board: [
          ['','','','','','',''],
          ['','','✦','','✦','',''],
          ['','✦','★','★','★','✦',''],
          ['','','★','♞','★','',''],
          ['','✦','★','★','★','✦',''],
          ['','','✦','','✦','',''],
          ['','','','','','',''],
        ],
      },
    ],
  },
  {
    title: 'Single Jump',
    tag: 'Movement',
    goal: 'See how one blocker can be cleared and the line stays open afterward.',
    steps: [
      {
        title: 'The blocker appears',
        note: 'The rook cannot normally pass the pawn.',
        board: [
          ['♖','','♟','','','♝'],
        ],
      },
      {
        title: 'Aura lets it jump once',
        note: 'The rook clears exactly one blocker and keeps moving.',
        board: [
          ['♖','→','♟','→','○','♝'],
        ],
      },
      {
        title: 'Capture becomes possible',
        note: 'After the jump, the rook may stop on an empty square or capture the bishop.',
        board: [
          ['','', '♟', '', '○', '♖'],
        ],
      },
    ],
  },
  {
    title: 'Second Blocker',
    tag: 'Limits',
    goal: 'Understand why the second piece still stops the move.',
    steps: [
      {
        title: 'Two blockers in line',
        note: 'Only the first blocker may be cleared.',
        board: [
          ['♕','','♟','','♜','',''],
        ],
      },
      {
        title: 'The queen clears one piece',
        note: 'The aura pays for one jump only.',
        board: [
          ['♕','→','♟','→','♜','✗',''],
        ],
      },
      {
        title: 'The second blocker holds',
        note: 'The queen must stop before the rook and cannot pass through it.',
        board: [
          ['','','♟','♕','♜','',''],
        ],
      },
    ],
  },
  {
    title: 'Pawn Breakthrough',
    tag: 'Practical',
    goal: 'Use aura pawns to crack files open earlier than normal chess allows.',
    steps: [
      {
        title: 'Pawn with support',
        note: 'The knight empowers the pawn from behind.',
        board: [
          ['','','','○','',''],
          ['','','','♟','',''],
          ['','','','♙','',''],
          ['','','','♞','',''],
        ],
      },
      {
        title: 'The pawn jumps the blocker',
        note: 'A pawn in the aura can leap one blocker straight ahead.',
        board: [
          ['','','','♙','',''],
          ['','','','♟','',''],
          ['','','','','',''],
          ['','','','♞','',''],
        ],
      },
      {
        title: 'The file opens',
        note: 'This often unlocks a rook or queen attack immediately.',
        board: [
          ['','','','♙','',''],
          ['','','','','',''],
          ['','','','','',''],
          ['','','','♞','',''],
        ],
      },
    ],
  },
];

export default function LearnPage({ onBack }) {
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const lesson = interactiveLessons[activeLesson];
  const step = lesson.steps[activeStep];

  const canGoPrev = activeStep > 0;
  const canGoNext = activeStep < lesson.steps.length - 1;

  const progressLabel = useMemo(
    () => `${activeStep + 1} / ${lesson.steps.length}`,
    [activeStep, lesson.steps.length]
  );

  return (
    <div className="learn-page">
      <header className="learn-page-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back to Game
        </button>
        <div className="learn-page-title">
          <h1>♞ How to Play Knight-Aura Chess</h1>
          <p>Standard chess — supercharged by the power of the horse</p>
        </div>
      </header>

      <section className="learn-hero">
        <div className="learn-hero-text">
          <h2>Unleash the Power of the Horse</h2>
          <p>
            In conventional chess, only the knight can jump over other pieces.
            In <strong>Knight-Aura Chess</strong>, that jumping power radiates outward —
            any friendly piece within the knight&apos;s aura can <strong>leap over one blocker</strong>.
          </p>
        </div>
      </section>

      <section className="learn-section learn-section--green">
        <div className="learn-section-badge">1</div>
        <div className="learn-section-body">
          <h3>The Knight&apos;s Aura Zone</h3>
          <p className="learn-section-subtitle">Ride close to the horse, gain its power</p>
          <p>
            Any friendly piece that is adjacent to a knight or reachable by its L-shaped jump
            is inside the aura and may jump one blocker.
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
                    return <div key={ci} className={cls}>{content}</div>;
                  })}
                </div>
              ))}
            </div>
            <div className="learn-aura-legend">
              <span className="learn-legend-item"><span className="learn-legend-swatch learn-legend--knight">♞</span> Knight</span>
              <span className="learn-legend-item"><span className="learn-legend-swatch learn-legend--adj">★</span> Adjacent</span>
              <span className="learn-legend-item"><span className="learn-legend-swatch learn-legend--knm">✦</span> Knight Move</span>
            </div>
          </div>
        </div>
      </section>

      <section className="learn-summary">
        <h3>Quick Reference</h3>
        <div className="learn-summary-grid">
          <div className="learn-summary-card">
            <span className="learn-summary-icon">♞</span>
            <strong>The Aura</strong>
            <p>8 adjacent + 8 knight-move squares = 16 empowered allies</p>
          </div>
          <div className="learn-summary-card">
            <span className="learn-summary-icon">⤴</span>
            <strong>The Jump</strong>
            <p>Leap over exactly one blocker, then keep sliding or capture</p>
          </div>
          <div className="learn-summary-card">
            <span className="learn-summary-icon">🛑</span>
            <strong>The Limit</strong>
            <p>One jump per move — the second blocker holds the line</p>
          </div>
        </div>
      </section>

      <section className="learn-tutorials learn-tutorials--interactive">
        <h3>Interactive Tutorials</h3>
        <p className="learn-tutorials-intro">
          Click through each lesson to watch the position change step by step.
        </p>

        <div className="learn-lesson-tabs">
          {interactiveLessons.map((item, index) => (
            <button
              key={item.title}
              className={`learn-lesson-tab${index === activeLesson ? ' active' : ''}`}
              onClick={() => {
                setActiveLesson(index);
                setActiveStep(0);
              }}
            >
              <span className="learn-lesson-tab-tag">{item.tag}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        <div className="learn-interactive-card">
          <div className="learn-interactive-copy">
            <div className="learn-interactive-header">
              <span className="learn-tutorial-tag">{lesson.tag}</span>
              <span className="learn-step-counter">{progressLabel}</span>
            </div>
            <h4>{lesson.title}</h4>
            <p className="learn-interactive-goal">{lesson.goal}</p>
            <div className="learn-step-card">
              <strong>{step.title}</strong>
              <p>{step.note}</p>
            </div>
            <div className="learn-interactive-actions">
              <button className="btn btn-ghost" onClick={() => setActiveStep(0)}>Reset</button>
              <button className="btn btn-ghost" onClick={() => canGoPrev && setActiveStep((value) => value - 1)} disabled={!canGoPrev}>
                Previous
              </button>
              <button className="btn btn-primary" onClick={() => canGoNext && setActiveStep((value) => value + 1)} disabled={!canGoNext}>
                Next
              </button>
            </div>
          </div>

          <div className="learn-demo-board" aria-label={`${lesson.title} demo`}>
            {step.board.map((row, rowIndex) => (
              <div key={rowIndex} className="learn-demo-row">
                {row.map((cell, cellIndex) => {
                  const dark = (rowIndex + cellIndex) % 2 === 1;
                  return (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      className={`learn-demo-cell${dark ? ' learn-demo-cell--dark' : ' learn-demo-cell--light'}${cell === '○' ? ' learn-demo-cell--target' : ''}${cell === '→' ? ' learn-demo-cell--path' : ''}`}
                    >
                      {cell === '○' ? '' : cell}
                    </div>
                  );
                })}
              </div>
            ))}
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
