import React from 'react';
import '../styles/ChessBoard.css';

/**
 * Simple HTML-based ChessBoard Component
 * Displays the chess board and handles piece selection
 */
export default function ChessBoard({
  game,
  selectedSquare,
  legalMoves,
  onSquareClick
}) {
  console.log('ChessBoard rendering with game:', game ? 'OK' : 'NULL', 'selectedSquare:', selectedSquare, 'legalMoves:', legalMoves);
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  // Piece symbols
  const pieceSymbols = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };
  
  const handleSquareClick = (square) => {
    onSquareClick(square);
  };
  
  const getPieceSymbol = (piece) => {
    const symbols = {
      'wp': '♙', 'wn': '♘', 'wb': '♗', 'wr': '♖', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'bn': '♞', 'bb': '♝', 'br': '♜', 'bq': '♛', 'bk': '♚'
    };
    return symbols[piece.color + piece.type] || '';
  };
  return (
    <div className="chessboard-wrapper">
      {game ? (
        <>
          <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '1rem', borderRadius: '4px' }}>
            <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
              <strong>Selected:</strong> {selectedSquare || 'None'} | <strong>Legal Moves:</strong> {legalMoves.length}
            </p>
          </div>
          
          <div style={{ 
            display: 'inline-block', 
            border: '2px solid #333',
            backgroundColor: '#8B7355'
          }}>
            {ranks.map(rank => (
              <div key={rank} style={{ display: 'flex' }}>
                {files.map(file => {
                  const square = file + rank;
                  const piece = game.get(square);
                  const isLight = (file.charCodeAt(0) + rank.charCodeAt(0)) % 2 === 1;
                  const isSelected = selectedSquare === square;
                  const isLegal = legalMoves.includes(square);
                  
                  let bgColor = isLight ? '#F0D9B5' : '#B58863';
                  if (isSelected) bgColor = 'rgba(247, 247, 0, 0.6)';
                  else if (isLegal) bgColor = piece ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 200, 0, 0.4)';
                  
                  return (
                    <div
                      key={square}
                      onClick={() => handleSquareClick(square)}
                      style={{
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: bgColor,
                        cursor: 'pointer',
                        fontSize: '32px',
                        userSelect: 'none',
                        border: isSelected ? '3px solid gold' : 'none'
                      }}
                    >
                      {piece ? getPieceSymbol(piece) : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="board-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(247, 247, 0, 0.6)' }}></span>
              Selected piece
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(0, 200, 0, 0.4)' }}></span>
              Legal move
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(255, 0, 0, 0.4)' }}></span>
              Capture move
            </div>
          </div>
        </>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
}
