import React, { useState } from 'react';
import KnightJumpChess from './KnightJumpChess.js';
import ChessBoard from './components/ChessBoard.jsx';
import './App.css';

/**
 * Main App component for Knight Jump Chess
 */
export default function App() {
  const [game, setGame] = useState(new KnightJumpChess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);

  /**
   * Handle piece selection
   */
  const handleSquareClick = (square) => {
    console.log('Square clicked:', square); // DEBUG
    
    if (selectedSquare === square) {
      // Deselect
      console.log('Deselecting:', square); // DEBUG
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Get the piece at this square
    const piece = game.get(square);
    console.log('Piece at', square, ':', piece); // DEBUG
    console.log('Current turn:', game.turn()); // DEBUG

    // If no piece selected yet, select this square if it has our piece
    if (!selectedSquare) {
      if (piece && piece.color === game.turn()) {
        console.log('Selecting piece at:', square); // DEBUG
        setSelectedSquare(square);
        // Get legal moves from this square
        const moves = game.moves({
          square: square,
          verbose: true
        });
        console.log('Legal moves from', square, ':', moves); // DEBUG
        setLegalMoves(moves.map(m => m.to));
      }
      return;
    }

    // Try to make the move
    if (legalMoves.includes(square)) {
      console.log('Making move:', selectedSquare, 'to', square); // DEBUG
      makeMove(selectedSquare, square);
    } else if (piece && piece.color === game.turn()) {
      // Select new piece
      console.log('Re-selecting piece at:', square); // DEBUG
      setSelectedSquare(square);
      const moves = game.moves({
        square: square,
        verbose: true
      });
      console.log('Legal moves from', square, ':', moves); // DEBUG
      setLegalMoves(moves.map(m => m.to));
    }
  };

  /**
   * Execute a move
   */
  const makeMove = (from, to) => {
    console.log('makeMove called:', from, 'to', to);
    const gameCopy = new KnightJumpChess(game.fen());
    console.log('Game copy created. Current turn:', gameCopy.turn());
    
    const moveResult = gameCopy.move({ from, to, promotion: 'q' });
    console.log('Move result:', moveResult);

    if (moveResult) {
      console.log('Move successful! New turn:', gameCopy.turn());
      setGame(gameCopy);
      setMoveHistory([...moveHistory, moveResult.san || `${from}-${to}`]);
      setSelectedSquare(null);
      setLegalMoves([]);
      console.log('Move executed successfully');
    } else {
      console.log('Move failed - trying to get available moves for debugging');
      const availableMoves = gameCopy.moves({ square: from, verbose: true });
      console.log('Available moves from', from, ':', availableMoves.map(m => m.to));
    }
  };

  /**
   * Reset the game
   */
  const resetGame = () => {
    setGame(new KnightJumpChess());
    setMoveHistory([]);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  /**
   * Undo last move
   */
  const undoMove = () => {
    if (moveHistory.length > 0) {
      const gameCopy = new KnightJumpChess();
      for (let i = 0; i < moveHistory.length - 1; i++) {
        // This is a simplified undo - in production you'd track moves differently
      }
      // For now, just show that feature exists
      console.log('Undo would go back to previous position');
    }
  };

  const gameStatus = () => {
    if (game.isCheckmate()) {
      return `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
    }
    if (game.isStalemate()) {
      return 'Stalemate - Draw!';
    }
    if (game.isCheck()) {
      return `Check! ${game.turn() === 'w' ? 'White' : 'Black'} to move`;
    }
    return `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  };

  return (
    <div className="app">
      <header>
        <h1>♘ Knight Jump Chess</h1>
        <p>A variant where pieces near knights can jump over blockers</p>
      </header>

      <main>
        <div className="game-container">
          <div className="board-section">
            <ChessBoard
              game={game}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              onSquareClick={handleSquareClick}
            />
          </div>

          <div className="sidebar">
            <div className="status">
              <h3>Game Status</h3>
              <p className="status-text">{gameStatus()}</p>
            </div>

            <div className="controls">
              <button onClick={resetGame} className="btn btn-primary">
                New Game
              </button>
              <button onClick={undoMove} className="btn" disabled={moveHistory.length === 0}>
                Undo
              </button>
            </div>

            <div className="move-history">
              <h3>Move History</h3>
              <div className="moves-list">
                {moveHistory.length === 0 ? (
                  <p className="empty">No moves yet</p>
                ) : (
                  <ol>
                    {moveHistory.map((move, index) => (
                      <li key={index}>
                        {index + 1}. {move}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            <div className="info">
              <h3>About</h3>
              <p>
                In this variant, pieces that are adjacent to or a knight's move away from a friendly
                knight can jump over one blocking piece and continue moving in their normal path.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>Knight Jump Chess - Educational Chess Variant</p>
      </footer>
    </div>
  );
}
