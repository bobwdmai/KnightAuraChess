# Knight Jump Chess - Phase 1 Game Logic

A chess variant where pieces near knights gain the ability to jump over blocking pieces.

## 🎮 Variant Rules

### Core Mechanic: Knight Proximity Jumping

**Jump Ability Trigger:**
- A piece can jump if it is **adjacent to** OR **within a knight's move** of a **friendly knight** (same color)
- Adjacent means horizontally, vertically, or diagonally next to a knight
- Knight's move means the standard L-shape (2 squares in one direction, 1 in perpendicular)
- **Important:** Only friendly knights enable jumping - enemy knights do not

**Jump Rules:**
1. **Standard Pieces (Rook, Bishop, Queen):**
   - Move along their normal paths (rook: straight, bishop: diagonal, queen: both)
   - Can jump over **ONE blocking piece** along that path
   - **After jumping, continue sliding normally** - can land on any empty square beyond the jumped piece
   - Can capture an enemy piece after the jump (stops there)
   - Stops when hitting a friendly piece after the jump
   - Example: Rook on a1 with pawn on c1 can jump to d1, e1, f1, g1, or h1

2. **Pawns:**
   - Can jump **one square forward** when blocked (landing two squares ahead)
   - Can jump **diagonally** when an enemy piece blocks a diagonal capture
   - Still follow pawn movement rules (forward only, diagonal captures)

3. **Kings:**
   - Can jump **one square in any direction** when blocked
   - Landing square must be two squares away from starting position

4. **Knights:**
   - Move normally (they enable jumping for others, not themselves)

**Important:** You can only jump over ONE piece per move. After jumping over that piece, you continue sliding along your normal path as far as you want (until hitting another piece or the board edge).

## 📦 Installation

```bash
# Clone or download this project
cd knight-jump-chess

# Install dependencies
npm install
```

## 🚀 Quick Start

### Running the Tests

```bash
npm test
```

This runs `src/test.js` which demonstrates:
- Knight proximity detection
- Jump moves for each piece type
- Verification that jumps only work when near knights

### Running Usage Examples

```bash
node src/usage-examples.js
```

This shows practical examples of:
- Creating a new game
- Getting legal moves
- Making moves
- Setting up custom positions
- Detecting jump opportunities

## 🛠️ Usage in Your Code

```javascript
import KnightJumpChess from './src/KnightJumpChess.js';

// Create a new game
const game = new KnightJumpChess();

// Get all legal moves (includes both normal and jump moves)
const moves = game.moves();

// Get moves for a specific square
const rookMoves = game.moves({ square: 'a1' });

// Get verbose move information
const verboseMoves = game.moves({ verbose: true });
// Each move object contains: from, to, piece, flags, san notation
// Jump moves have flags='j' and jumpedOver property

// Make a move
game.move('e4');        // Standard notation
game.move({ from: 'e2', to: 'e4' }); // Object notation

// Check if a square is near a friendly knight
const canJump = game.isNearKnight('e4', 'w'); // Check for white pieces

// Set up custom positions
game.clear();
game.put({ type: 'k', color: 'w' }, 'e1');
game.put({ type: 'n', color: 'w' }, 'e2');
game.setTurn('w');
```

## 📋 API Reference

### Main Methods

#### `new KnightJumpChess(fen?)`
Create a new game. Optionally pass a FEN string to start from a specific position.

#### `moves(options?)`
Get all legal moves.
- **options.square**: Get moves only for this square (e.g., 'e4')
- **options.piece**: Get moves only for this piece type (e.g., 'n' for knight)
- **options.verbose**: Return detailed move objects instead of SAN strings
- **Returns:** Array of moves (strings or objects)

#### `move(move)`
Make a move.
- **move**: Can be SAN string ('e4') or object ({ from: 'e2', to: 'e4' })
- **Returns:** Move object if successful, null if illegal

#### `isNearKnight(square, color)`
Check if a square is within jumping range of a friendly knight.
- **square**: Algebraic notation (e.g., 'e4')
- **color**: Color of the piece ('w' or 'b')
- **Returns:** Boolean

#### `getKnightsOnBoard()`
Get all knights currently on the board.
- **Returns:** Array of { square, color } objects

### Inherited from chess.js

All standard chess.js methods are available:
- `fen()` - Get current position in FEN notation
- `board()` - Get 8x8 array representation of board
- `get(square)` - Get piece at square
- `put(piece, square)` - Place piece on square
- `remove(square)` - Remove piece from square
- `clear()` - Clear the board
- `turn()` - Get current turn ('w' or 'b')
- `history()` - Get move history
- `undo()` - Undo last move
- `in_check()` - Check if current player is in check
- `in_checkmate()` - Check if current player is in checkmate
- `in_stalemate()` - Check if position is stalemate
- `in_draw()` - Check if position is a draw
- `game_over()` - Check if game is over

## 🎯 Jump Move Notation

Jump moves use custom notation to distinguish them from normal moves:

**Format:** `[Piece][from][capture?][to]^[jumped_over]`

Examples:
- `Ra1-d1^c1` - Rook from a1 to d1, jumped over piece on c1
- `Pa2xd4^c3` - Pawn from a2 captures on d4, jumped over piece on c3
- `Ke1-e3^e2` - King from e1 to e3, jumped over piece on e2

**Flags:**
- `j` - Jump move
- `c` - Capture (combined with jump: `jc`)
- `p` - Promotion (combined with jump: `jp`)

## 🧪 Testing Strategy

The included test suite (`src/test.js`) covers:

✅ Knight proximity detection (adjacent and L-shape)
✅ Rook jumping over blockers
✅ Pawn forward jumps
✅ King jumps in all directions
✅ Bishop diagonal jumps
✅ No jumps without nearby knights
✅ Basic move making

### Still Needed (Phase 2):
- Edge case handling (board boundaries)
- Multiple knights creating overlapping zones
- Check/checkmate validation with jump moves
- Castling legality near knights
- En passant interactions
- Pawn promotion during jumps
- Stalemate detection
- Draw by repetition

## 🔧 Known Limitations

This Phase 1 implementation has some limitations:

1. **Move Execution:** The `makeJumpMove()` method uses a simplified approach. A full implementation would need deeper integration with chess.js internals.

2. **Check Detection:** Currently uses chess.js's standard check detection, which may not fully account for jump moves creating unexpected checks.

3. **Castling:** May allow castling in situations where a jumped piece should prevent it.

4. **Performance:** Move generation could be optimized for large numbers of knights.

5. **Notation Ambiguity:** When multiple pieces can reach the same square via jumping, additional disambiguation may be needed.

## 📈 Next Steps (Phase 2)

To complete the game logic before building the UI:

1. **Comprehensive Testing:** Write unit tests for all edge cases
2. **Check/Checkmate:** Ensure jump moves are properly validated for check
3. **Castling Rules:** Define how knights affect castling legality
4. **Performance:** Optimize move generation algorithm
5. **Notation:** Refine jump move notation for clarity
6. **AI Support:** Create evaluation function for computer opponents

## 🎨 Integration with React (Phase 2)

Once the game logic is solid, integrate with a UI:

```javascript
import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import KnightJumpChess from './KnightJumpChess';

function ChessGame() {
  const [game, setGame] = useState(new KnightJumpChess());
  const [position, setPosition] = useState(game.fen());

  function onDrop(sourceSquare, targetSquare) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to queen for simplicity
    });

    if (move === null) return false; // illegal move

    setPosition(game.fen());
    return true;
  }

  return (
    <Chessboard 
      position={position} 
      onPieceDrop={onDrop}
    />
  );
}
```

## 🤝 Contributing

This is Phase 1 starter code. Improvements needed:
- Better check/checkmate detection
- Comprehensive test coverage
- Performance optimization
- More robust move execution
- Better notation system

## 📄 License

MIT

## 🔗 Resources

- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [react-chessboard](https://github.com/Clariity/react-chessboard)
- [Chess Variant Resources](https://www.chessvariants.com/)
