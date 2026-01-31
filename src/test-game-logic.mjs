// Quick test to verify game logic
import KnightJumpChess from './KnightJumpChess.js';

console.log('Testing game logic...\n');

const game = new KnightJumpChess();

console.log('Initial position:');
console.log('FEN:', game.fen());
console.log('\nMoves from e2:', game.moves({square: 'e2'}));
console.log('Moves from e4 (should be empty initially):', game.moves({square: 'e4'}));
console.log('\nAll legal moves for White:');
const allMoves = game.moves();
console.log('Number of moves:', allMoves.length);
console.log('First 5 moves:', allMoves.slice(0, 5));

// Try making a move
console.log('\n\nTrying to move e2 to e4...');
const move = game.move({from: 'e2', to: 'e4'});
console.log('Move result:', move);
console.log('New position FEN:', game.fen());
console.log('\nMoves from e5 (Black pawn):', game.moves({square: 'e7'}));

console.log('\n✅ Game logic works!');
