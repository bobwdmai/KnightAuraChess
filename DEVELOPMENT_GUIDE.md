# Development Guide & Troubleshooting

## Getting Started

### Installation
```bash
cd c:\GitHub\PyChess
npm install  # Install all dependencies
npm run dev  # Start development server
npm test     # Run game logic tests
npm run build # Build for production
```

### Development Workflow
1. Keep `npm run dev` running in a terminal
2. Edit files in `src/` folder
3. Changes auto-reload in browser
4. Check browser console (F12) for errors
5. Check terminal for Vite warnings

## Common Issues & Solutions

### Issue: "Cannot find module 'react'"
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Styles not loading
**Solution:** Make sure CSS files are imported:
- App.jsx imports App.css
- components import their CSS files
- index.css is imported in main.jsx

### Issue: Board not displaying
**Solution:** 
1. Check browser console for errors (F12)
2. Verify react-chessboard is installed: `npm list react-chessboard`
3. Check that position/FEN is valid: `console.log(game.fen())`

### Issue: Moves not working
**Solution:**
1. Verify KnightJumpChess.js is in src/ folder
2. Check that chess.js is installed: `npm list chess.js`
3. Test game logic separately: `npm test`
4. Check console for error messages

### Issue: Port 5173 already in use
**Solution:** Either:
- Close other applications using port 5173
- Use different port: `npm run dev -- --port 3000`
- Check what's using the port: `netstat -ano | findstr :5173`

## Code Structure Explanation

### KnightJumpChess.js
- Extends chess.js Chess class
- Overrides methods: `put()`, `remove()`, `clear()`, `_pieceKey()`, `moves()`, `move()`
- Custom methods: `isNearKnight()`, `generateJumpMoves()`, various piece jump generators
- Exports as ES6 module

### App.jsx
- Main React component
- State management: game, moveHistory, selectedSquare, legalMoves
- Handles piece selection logic
- Executes moves and updates UI
- Displays game status

### ChessBoard.jsx
- Functional component that displays the board
- Uses react-chessboard library
- Custom square styling for visual feedback
- Knight zone highlighting
- Legend explaining colors

### Styling
- index.css: Global styles and layout
- App.css: App-specific theme
- styles/ChessBoard.css: Board component styles
- Mobile responsive using CSS media queries

## Key JavaScript Concepts Used

### ES6 Modules
```javascript
import KnightJumpChess from './KnightJumpChess.js';
export default function App() { ... }
```

### React Hooks
- useState: For game state, selected square, move history
- Component lifecycle: Controlled re-renders when state changes

### Method Overriding (in KnightJumpChess)
```javascript
class KnightJumpChess extends Chess {
  put(piece, square) {
    const result = super.put(piece, square);
    this._resetInternalState();
    return result;
  }
}
```

### Conditional Rendering
```jsx
{moveHistory.length === 0 ? (
  <p>No moves yet</p>
) : (
  <ol>{moveHistory.map(...)}</ol>
)}
```

## Performance Tips

1. **Avoid recreating KnightJumpChess unnecessarily**
   - Only create new instance when needed
   - Reuse game state when possible

2. **Move calculation is expensive**
   - `game.moves()` calculates all legal moves
   - Cache results if calling multiple times

3. **Board re-renders on state change**
   - React efficiently updates only changed parts
   - Don't create new objects in render method

## Debugging Tips

### Check Game State
```javascript
// In browser console:
// (assuming window.game is exposed)
game.fen()          // Current position
game.moves()        // All legal moves
game.turn()         // Whose turn ('w' or 'b')
game.isCheck()      // Is king in check?
game.get('e4')      // What piece on e4?
```

### Add Logging
```javascript
// In App.jsx
const makeMove = (from, to) => {
  console.log(`Attempting move: ${from} -> ${to}`);
  const moves = game.moves({ square: from, verbose: true });
  console.log('Legal moves:', moves);
  // ... rest of move logic
}
```

### Inspect Board State
```javascript
// Log the entire board
const board = game.board();
console.table(board);
```

## Testing the Game Logic

### Unit Tests (Existing)
```bash
npm test
```
This runs src/test.js which validates:
- Knight proximity detection
- Jump mechanics
- Move generation
- Piece behavior

### Manual Testing
1. Test piece selection and deselection
2. Test all piece types (pawn, rook, bishop, queen, king, knight)
3. Test captures vs regular moves
4. Test check/checkmate conditions
5. Test edge cases (multiple knights, blocked pieces)

## File Modification Checklist

When adding new features, update:
- [ ] App.jsx (add state if needed)
- [ ] Component file (update display)
- [ ] CSS file (add styling)
- [ ] index.html (if adding new elements)
- [ ] Test files (if changing core logic)

## Git & Version Control

```bash
# Initialize git (if not already done)
git init

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# View history
git log
```

## Resources

- Chess.js documentation: https://github.com/jhlywa/chess.js
- React documentation: https://react.dev
- React-chessboard: https://www.npmjs.com/package/react-chessboard
- Vite documentation: https://vitejs.dev
- CSS Guide: https://developer.mozilla.org/en-US/docs/Web/CSS

## Next Steps

1. **Test Phase 1** - Verify the game works correctly with various positions
2. **Start Phase 2** - Add UI enhancements from PHASE2_GUIDE.md
3. **Plan Phase 3** - Design backend architecture for multiplayer
4. **Community Testing** - Share with chess friends for feedback

---

**Questions?** Check the source code comments or review the Chess.js documentation for API details.
