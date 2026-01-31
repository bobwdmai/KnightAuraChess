import KnightJumpChess from './KnightJumpChess.js';

/**
 * Simple Usage Examples
 * This shows how to use the KnightJumpChess class in your application
 */

// Example 1: Starting a new game
console.log('=== Example 1: New Game ===');
const game = new KnightJumpChess();
console.log('Initial position:', game.fen());
console.log('');

// Example 2: Getting all legal moves
console.log('=== Example 2: Legal Moves ===');
const allMoves = game.moves();
console.log('Total legal moves at start:', allMoves.length);
console.log('First few moves:', allMoves.slice(0, 5));
console.log('');

// Example 3: Getting moves for a specific piece
console.log('=== Example 3: Moves for Specific Piece ===');
const knightMoves = game.moves({ square: 'b1' });
console.log('Knight on b1 can move to:', knightMoves);
console.log('');

// Example 4: Making moves
console.log('=== Example 4: Making Moves ===');
console.log('Playing: 1. e4 e5 2. Nf3');
game.move('e4');
console.log('After e4:', game.turn(), 'to move');
game.move('e5');
console.log('After e5:', game.turn(), 'to move');
game.move('Nf3');
console.log('After Nf3:', game.turn(), 'to move');
console.log('Current FEN:', game.fen());
console.log('');

// Example 5: Setting up a custom position to demonstrate jumps
console.log('=== Example 5: Jump Move Demo ===');
const jumpDemo = new KnightJumpChess();
jumpDemo.clear();

// Set up a position where a rook can jump
jumpDemo.put({ type: 'k', color: 'w' }, 'e1');  // White king
jumpDemo.put({ type: 'k', color: 'b' }, 'e8');  // Black king
jumpDemo.put({ type: 'n', color: 'w' }, 'a2');  // White knight (enables jump)
jumpDemo.put({ type: 'r', color: 'w' }, 'a1');  // White rook
jumpDemo.put({ type: 'p', color: 'b' }, 'c1');  // Black pawn blocking
jumpDemo.setTurn('w');

console.log('Custom position FEN:', jumpDemo.fen());
console.log('White knight on a2 (adjacent to rook on a1)');
console.log('Black pawn on c1 (blocking the rook)');
console.log('Rook can jump c1 and continue sliding to d1, e1, f1, g1, or h1');
console.log('');

const rookMoves = jumpDemo.moves({ square: 'a1', verbose: true });
console.log('Rook on a1 legal moves:');
rookMoves.forEach(move => {
  const isJump = move.flags && move.flags.includes('j');
  if (isJump) {
    console.log(`  ${move.san} -> ${move.to} (JUMP over ${move.jumpedOver}!)`);
  }
});
console.log('');

// Example 6: Detecting if a square is near a knight
console.log('=== Example 6: Knight Proximity Check ===');
const checkGame = new KnightJumpChess();
console.log('Standard opening position:');
console.log('Is e4 near a white knight?', checkGame.isNearKnight('e4', 'w')); // Should be true (knight on g1 or b1)
console.log('Is a4 near a white knight?', checkGame.isNearKnight('a4', 'w')); // Should be false
console.log('Is c3 near a white knight?', checkGame.isNearKnight('c3', 'w')); // Should be true (knight's move from b1)
console.log('');

// Example 7: Verbose move information
console.log('=== Example 7: Verbose Move Info ===');
const verboseGame = new KnightJumpChess();
verboseGame.clear();
verboseGame.put({ type: 'k', color: 'w' }, 'e1');
verboseGame.put({ type: 'k', color: 'b' }, 'e8');
verboseGame.put({ type: 'n', color: 'w' }, 'b3');  // Knight
verboseGame.put({ type: 'p', color: 'w' }, 'a2');  // Pawn near knight
verboseGame.put({ type: 'p', color: 'b' }, 'a3');  // Blocking pawn
verboseGame.setTurn('w');

const pawnMoves = verboseGame.moves({ square: 'a2', verbose: true });
console.log('Pawn on a2 (near knight on b3, blocked by pawn on a3):');
pawnMoves.forEach(move => {
  console.log(`Move: ${move.san}`);
  console.log(`  From: ${move.from}, To: ${move.to}`);
  console.log(`  Flags: ${move.flags}`);
  console.log(`  Is Jump: ${move.flags && move.flags.includes('j')}`);
  if (move.jumpedOver) {
    console.log(`  Jumped over: ${move.jumpedOver}`);
  }
  console.log('');
});

// Example 8: Move history
console.log('=== Example 8: Move History ===');
const historyGame = new KnightJumpChess();
historyGame.move('e4');
historyGame.move('e5');
historyGame.move('Nf3');
historyGame.move('Nc6');

console.log('Move history:', historyGame.history());
console.log('Move history (verbose):', historyGame.history({ verbose: true }));
console.log('');

console.log('=== Usage Examples Complete ===');
console.log('\nNext steps:');
console.log('1. Integrate this into a React component');
console.log('2. Add a chess board UI (use react-chessboard)');
console.log('3. Display legal moves visually');
console.log('4. Highlight squares near knights');
console.log('5. Add special notation/indicator for jump moves');
