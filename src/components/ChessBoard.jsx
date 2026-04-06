import React from 'react';
import wp from '../assets/chess/cburnett/Chess_plt45.svg';
import wn from '../assets/chess/cburnett/Chess_nlt45.svg';
import wb from '../assets/chess/cburnett/Chess_blt45.svg';
import wr from '../assets/chess/cburnett/Chess_rlt45.svg';
import wq from '../assets/chess/cburnett/Chess_qlt45.svg';
import wk from '../assets/chess/cburnett/Chess_klt45.svg';
import bp from '../assets/chess/cburnett/Chess_pdt45.svg';
import bn from '../assets/chess/cburnett/Chess_ndt45.svg';
import bb from '../assets/chess/cburnett/Chess_bdt45.svg';
import br from '../assets/chess/cburnett/Chess_rdt45.svg';
import bq from '../assets/chess/cburnett/Chess_qdt45.svg';
import bk from '../assets/chess/cburnett/Chess_kdt45.svg';
import wp3d from '../assets/chess/blue/Chess_pbg45.svg';
import wn3d from '../assets/chess/blue/Chess_nbg45.svg';
import wb3d from '../assets/chess/blue/Chess_bbg45.svg';
import wr3d from '../assets/chess/blue/Chess_rbg45.svg';
import wq3d from '../assets/chess/blue/Chess_qbt45.svg';
import wk3d from '../assets/chess/blue/Chess_kbt45.svg';
import bp3d from '../assets/chess/blue/Chess_pbt45.svg';
import bn3d from '../assets/chess/blue/Chess_nbt45.svg';
import bb3d from '../assets/chess/blue/Chess_bbt45.svg';
import br3d from '../assets/chess/blue/Chess_rbt45.svg';
import bq3d from '../assets/chess/blue/Chess_qbt45.svg';
import bk3d from '../assets/chess/blue/Chess_kbt45.svg';
import '../styles/ChessBoard.css';

const classicPieceSprites = {
  w: { p: wp, n: wn, b: wb, r: wr, q: wq, k: wk },
  b: { p: bp, n: bn, b: bb, r: br, q: bq, k: bk }
};

const board3dPieceSprites = {
  w: { p: wp3d, n: wn3d, b: wb3d, r: wr3d, q: wq3d, k: wk3d },
  b: { p: bp3d, n: bn3d, b: bb3d, r: br3d, q: bq3d, k: bk3d }
};

const pieceLetters = {
  w: { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' },
  b: { p: 'p', n: 'n', b: 'b', r: 'r', q: 'q', k: 'k' }
};

export default function ChessBoard({
  game,
  selectedSquare,
  legalMoves,
  onSquareClick,
  theme,
  customThemeVars,
  pieceStyle,
  lastMove,
  flipped,
  inCheck,
  board3d,
}) {
  const filesBase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranksBase = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const files = flipped ? [...filesBase].reverse() : filesBase;
  const ranks = flipped ? [...ranksBase].reverse() : ranksBase;

  // Get knight aura squares when a piece is selected
  const getKnightAuraSquares = () => {
    if (!game || !selectedSquare) return new Set();
    const piece = game.get(selectedSquare);
    if (!piece) return new Set();

    const color = piece.color;
    const auraSquares = new Set();  
    // Check which squares are near a friendly knight
    for (const r of ranksBase) {
      for (const f of filesBase) {
        const sq = `${f}${r}`;
        if (game.isNearKnight(sq, color)) {
          auraSquares.add(sq);
        }
      }
    }
    return auraSquares;
  };

  const knightAuraSquares = getKnightAuraSquares();

  const getAuraPieceSquares = () => {
    if (!game) return new Set();

    const auraPieceSquares = new Set();
    for (const r of ranksBase) {
      for (const f of filesBase) {
        const sq = `${f}${r}`;
        const piece = game.get(sq);
        if (!piece || piece.type === 'n') continue;
        if (game.isNearKnight(sq, piece.color)) {
          auraPieceSquares.add(sq);
        }
      }
    }
    return auraPieceSquares;
  };

  const auraPieceSquares = getAuraPieceSquares();

  // Find king in check
  const getCheckSquare = () => {
    if (!game || !inCheck) return null;
    const turn = game.turn();
    for (const r of ranksBase) {
      for (const f of filesBase) {
        const sq = `${f}${r}`;
        const piece = game.get(sq);
        if (piece && piece.type === 'k' && piece.color === turn) return sq;
      }
    }
    return null;
  };

  const checkSquare = getCheckSquare();

  const themeClass = theme?.startsWith('custom:') ? 'theme-custom' : `theme-${theme || 'classic'}`;
  const effectivePieceStyle = board3d ? 'svg' : pieceStyle;
  const activePieceSprites = board3d ? board3dPieceSprites : classicPieceSprites;

  return (
    <div
      className={`chessboard-wrapper ${themeClass}${board3d ? ' board--3d' : ''}`}
      style={theme?.startsWith('custom:') ? customThemeVars : undefined}
    >
      {game ? (
        <div className="board-surface">
          <div className="board-grid">
            {ranks.map((rank) =>
              files.map((file) => {
                const square = `${file}${rank}`;
                const piece = game.get(square);
                const isLight = (file.charCodeAt(0) + rank.charCodeAt(0)) % 2 === 1;
                const isSelected = selectedSquare === square;
                const isLegal = legalMoves.includes(square);
                const isCapture = isLegal && piece && piece.color !== game.turn();
                const isLastFrom = lastMove && lastMove.from === square;
                const isLastTo = lastMove && lastMove.to === square;
                const isCheck = checkSquare === square;
                const isAura = knightAuraSquares.has(square) && selectedSquare;
                const isAuraPiece = auraPieceSquares.has(square);

                const squareClass = [
                  'square',
                  isLight ? 'square--light' : 'square--dark',
                  isSelected ? 'square--selected' : '',
                  isLegal && !isCapture ? 'square--legal' : '',
                  isCapture ? 'square--capture' : '',
                  isLastFrom ? 'square--last-from' : '',
                  isLastTo ? 'square--last-to' : '',
                  isCheck ? 'square--check' : '',
                  isAura && !isSelected && !isLegal ? 'square--aura' : '',
                  piece ? 'square--occupied' : '',
                  isSelected ? 'square--holding' : ''
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={square}
                    type="button"
                    className={squareClass}
                    onClick={() => onSquareClick(square)}
                    aria-label={`Square ${square}`}
                  >
                    {piece && (
                      <span className={`piece-shell${isAuraPiece ? ' piece-shell--aura' : ''}${board3d && isSelected ? ' piece-shell--holding' : ''}`}>
                        {effectivePieceStyle === 'svg' ? (
                          <img
                            className="piece-image"
                            src={activePieceSprites[piece.color][piece.type]}
                            alt=""
                            draggable="false"
                          />
                        ) : (
                          <span className={`piece piece--${piece.color}`}>
                            {pieceLetters[piece.color][piece.type]}
                          </span>
                        )}
                        {isAuraPiece && <span className="piece-aura-mark">✦</span>}
                      </span>
                    )}
                    {rank === (flipped ? '8' : '1') && (
                      <span className="file-label">{file}</span>
                    )}
                    {file === (flipped ? 'h' : 'a') && (
                      <span className="rank-label">{rank}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
}
