import KnightJumpChess from './KnightJumpChess.js';

/**
 * Test Suite for Knight Jump Chess
 * Run these tests to verify the jump mechanics work correctly
 */

console.log('=== Knight Jump Chess - Test Suite ===\n');

// Test 1: Basic Knight Proximity Detection
console.log('Test 1: Knight Proximity Detection');
const game1 = new KnightJumpChess();
game1.clear();
game1.put({ type: 'n', color: 'w' }, 'e4'); // Knight on e4
game1.put({ type: 'r', color: 'w' }, 'e5'); // Rook adjacent to knight

console.log('Knight on e4, Rook on e5');
console.log('Is e5 near white knight?', game1.isNearKnight('e5', 'w')); // Should be true (adjacent)
console.log('Is d2 near white knight?', game1.isNearKnight('d2', 'w')); // Should be true (knight's move)
console.log('Is a1 near white knight?', game1.isNearKnight('a1', 'w')); // Should be false
console.log('');

// Test 2: Rook Jump Over One Piece and Continue Sliding
console.log('Test 2: Rook Jumping Over Blocker and Continuing');
const game2 = new KnightJumpChess();
game2.clear();
game2.put({ type: 'n', color: 'w' }, 'a2'); // Knight adjacent to a1
game2.put({ type: 'r', color: 'w' }, 'a1'); // Rook on a1
game2.put({ type: 'p', color: 'b' }, 'c1'); // Black pawn blocking on c1
game2.put({ type: 'k', color: 'w' }, 'e1'); // White king
game2.put({ type: 'k', color: 'b' }, 'e8'); // Black king

console.log('Setup: White rook a1, knight a2, black pawn c1');
console.log('Rook should be able to jump over c1 and land on d1, e1, f1, g1, or h1');
const rookMoves = game2.moves({ square: 'a1', verbose: true });
console.log('Rook jump moves from a1:');
rookMoves.forEach(m => {
  if (m.flags && m.flags.includes('j')) {
    console.log(`  - ${m.san} to ${m.to} (jumped over ${m.jumpedOver})`);
  }
});
console.log('');

// Test 3: Pawn Jump When Blocked
console.log('Test 3: Pawn Jumping Forward');
const game3 = new KnightJumpChess();
game3.clear();
game3.put({ type: 'n', color: 'w' }, 'e3'); // Knight near pawn
game3.put({ type: 'p', color: 'w' }, 'e2'); // White pawn
game3.put({ type: 'p', color: 'b' }, 'e3'); // Black pawn blocking
game3.put({ type: 'k', color: 'w' }, 'a1'); // Kings
game3.put({ type: 'k', color: 'b' }, 'a8');

console.log('Setup: White pawn e2, knight e3 (but also black pawn e3 blocking)');
console.log('Actually, let me fix this setup...');

game3.clear();
game3.put({ type: 'n', color: 'w' }, 'd3'); // Knight near pawn
game3.put({ type: 'p', color: 'w' }, 'e2'); // White pawn
game3.put({ type: 'p', color: 'b' }, 'e3'); // Black pawn blocking forward
game3.put({ type: 'k', color: 'w' }, 'a1'); // Kings
game3.put({ type: 'k', color: 'b' }, 'a8');

console.log('Fixed: White pawn e2, knight d3, black pawn e3 blocking');
const pawnMoves = game3.moves({ square: 'e2', verbose: true });
console.log('Pawn moves from e2:');
pawnMoves.forEach(m => {
  console.log(`  - ${m.san} (${m.flags.includes('j') ? 'JUMP' : 'normal'})`);
});
console.log('');

// Test 4: King Jump
console.log('Test 4: King Jumping');
const game4 = new KnightJumpChess();
game4.clear();
game4.put({ type: 'n', color: 'w' }, 'e2'); // Knight adjacent to king
game4.put({ type: 'k', color: 'w' }, 'e1'); // White king
game4.put({ type: 'p', color: 'b' }, 'e2'); // Black pawn blocking
game4.put({ type: 'k', color: 'b' }, 'a8'); // Black king

console.log('Wait, knight and pawn can\'t both be on e2. Let me fix...');

game4.clear();
game4.put({ type: 'n', color: 'w' }, 'd2'); // Knight near king
game4.put({ type: 'k', color: 'w' }, 'e1'); // White king
game4.put({ type: 'p', color: 'b' }, 'e2'); // Black pawn blocking
game4.put({ type: 'k', color: 'b' }, 'a8'); // Black king

console.log('Fixed: White king e1, knight d2, black pawn e2 blocking');
const kingMoves = game4.moves({ square: 'e1', verbose: true });
console.log('King moves from e1:');
kingMoves.forEach(m => {
  if (m.from === 'e1') {
    console.log(`  - ${m.san} (${m.flags.includes('j') ? 'JUMP' : 'normal'})`);
  }
});
console.log('');

// Test 5: Bishop Jump and Continue Sliding
console.log('Test 5: Bishop Diagonal Jump and Continue');
const game5 = new KnightJumpChess();
game5.clear();
game5.put({ type: 'n', color: 'w' }, 'a2'); // Knight adjacent to bishop
game5.put({ type: 'b', color: 'w' }, 'a1'); // White bishop
game5.put({ type: 'p', color: 'b' }, 'b2'); // Black pawn blocking diagonal
game5.put({ type: 'k', color: 'w' }, 'e1'); // Kings
game5.put({ type: 'k', color: 'b' }, 'e8');

console.log('Setup: White bishop a1, knight a2, black pawn b2 blocking');
console.log('Bishop should jump b2 and continue to c3, d4, e5, f6, g7, h8');
const bishopMoves = game5.moves({ square: 'a1', verbose: true });
console.log('Bishop jump moves from a1:');
bishopMoves.forEach(m => {
  if (m.flags && m.flags.includes('j')) {
    console.log(`  - ${m.san} to ${m.to} (jumped over ${m.jumpedOver})`);
  }
});
console.log('');

// Test 6: No Jump Without Knight
console.log('Test 6: No Jump Without Knight Nearby');
const game6 = new KnightJumpChess();
game6.clear();
game6.put({ type: 'r', color: 'w' }, 'a1'); // Rook
game6.put({ type: 'p', color: 'b' }, 'b1'); // Blocker
game6.put({ type: 'k', color: 'w' }, 'e1'); // Kings
game6.put({ type: 'k', color: 'b' }, 'e8');
// No knight!

console.log('Setup: White rook a1, black pawn b1, NO knight');
const noJumpMoves = game6.moves({ square: 'a1', verbose: true });
console.log('Rook moves from a1 (should not include jumps):');
console.log('Number of moves:', noJumpMoves.length);
console.log('Any jump moves?', noJumpMoves.some(m => m.flags && m.flags.includes('j'))); // Should be false
console.log('');

// Test 6b: Enemy Knight Doesn't Enable Jumps
console.log('Test 6b: Enemy Knight Does NOT Enable Jumps');
const game6b = new KnightJumpChess();
game6b.clear();
game6b.put({ type: 'r', color: 'w' }, 'a1'); // White rook
game6b.put({ type: 'p', color: 'b' }, 'b1'); // Black blocker
game6b.put({ type: 'n', color: 'b' }, 'a2'); // BLACK knight (enemy)
game6b.put({ type: 'k', color: 'w' }, 'e1'); // Kings
game6b.put({ type: 'k', color: 'b' }, 'e8');

console.log('Setup: White rook a1, black pawn b1, BLACK knight a2 (enemy)');
const noEnemyJumpMoves = game6b.moves({ square: 'a1', verbose: true });
console.log('Rook moves from a1 (should NOT include jumps - enemy knight):');
console.log('Number of moves:', noEnemyJumpMoves.length);
console.log('Any jump moves?', noEnemyJumpMoves.some(m => m.flags && m.flags.includes('j'))); // Should be false
console.log('');

// Test 6c: Friendly Knight DOES Enable Jumps
console.log('Test 6c: Friendly Knight DOES Enable Jumps');
const game6c = new KnightJumpChess();
game6c.clear();
game6c.put({ type: 'r', color: 'w' }, 'a1'); // White rook
game6c.put({ type: 'p', color: 'b' }, 'b1'); // Black blocker
game6c.put({ type: 'n', color: 'w' }, 'a2'); // WHITE knight (friendly)
game6c.put({ type: 'k', color: 'w' }, 'e1'); // Kings
game6c.put({ type: 'k', color: 'b' }, 'e8');

console.log('Setup: White rook a1, black pawn b1, WHITE knight a2 (friendly)');
const friendlyJumpMoves = game6c.moves({ square: 'a1', verbose: true });
console.log('Rook moves from a1 (SHOULD include jumps - friendly knight):');
console.log('Number of moves:', friendlyJumpMoves.length);
console.log('Any jump moves?', friendlyJumpMoves.some(m => m.flags && m.flags.includes('j'))); // Should be TRUE
console.log('');

// Test 8: Comprehensive Sliding After Jump
console.log('Test 8: Rook Jumps and Continues - Multiple Landing Options');
const game8 = new KnightJumpChess();
game8.clear();
game8.put({ type: 'n', color: 'w' }, 'b1'); // Knight near rook
game8.put({ type: 'r', color: 'w' }, 'a1'); // White rook
game8.put({ type: 'p', color: 'b' }, 'c1'); // Black pawn to jump over
game8.put({ type: 'p', color: 'b' }, 'g1'); // Another black pawn further down
game8.put({ type: 'k', color: 'w' }, 'a8'); // Kings
game8.put({ type: 'k', color: 'b' }, 'h8');

console.log('Setup: Rook a1, knight b1, pawn c1 (to jump), pawn g1 (can capture)');
console.log('Rook can jump c1 and land on: d1, e1, f1, or g1(capture)');
const slidingJumps = game8.moves({ square: 'a1', verbose: true });
const jumpMoves = slidingJumps.filter(m => m.flags && m.flags.includes('j'));
console.log(`Found ${jumpMoves.length} jump moves:`);
jumpMoves.forEach(m => {
  const action = m.flags.includes('c') ? 'captures' : 'moves to';
  console.log(`  - Rook ${action} ${m.to} (jumped ${m.jumpedOver})`);
});
console.log('');

// Test 7: Complete Game Example
console.log('Test 7: Playing Moves');
const game7 = new KnightJumpChess();
console.log('Starting position FEN:', game7.fen());
console.log('Making move: e4');
game7.move('e4');
console.log('After e4:', game7.fen());
console.log('Making move: e5');
game7.move('e5');
console.log('After e5:', game7.fen());
console.log('Making move: Nf3');
game7.move('Nf3');
console.log('After Nf3:', game7.fen());
console.log('');

console.log('=== Tests Complete ===');
console.log('\nNote: This is a basic test suite. More comprehensive testing needed for:');
console.log('- Edge cases (board boundaries)');
console.log('- Multiple knights creating overlapping zones');
console.log('- Check/checkmate with jump moves');
console.log('- Castling interactions');
console.log('- En passant interactions');
console.log('- Promotion during jumps');
