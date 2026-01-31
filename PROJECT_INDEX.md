# Knight Jump Chess - Project Index & Quick Reference

## 🎯 Project Status: Phase 1 Complete ✅

A fully functional Knight Jump Chess web application built with React + Vite.

**Live Demo**: http://localhost:5173 (while `npm run dev` is running)

---

## 📁 Directory Structure

```
c:\GitHub\PyChess\
│
├── 📄 Documentation Files (Read These!)
│   ├── README.md                    ← Original project description
│   ├── COMPLETION_SUMMARY.md        ← Phase 1 summary & achievement metrics
│   ├── PHASE1_README.md             ← Quick start & status
│   ├── PHASE1_COMPLETE.md           ← Detailed Phase 1 breakdown
│   ├── PHASE2_GUIDE.md              ← Next phase planning (UI enhancements)
│   ├── DEVELOPMENT_GUIDE.md         ← Troubleshooting & debugging help
│   ├── GAMEPLAY_GUIDE.md            ← How to play the game
│   └── PROJECT_INDEX.md             ← This file!
│
├── ⚙️ Configuration Files
│   ├── package.json                 ← Dependencies & npm scripts
│   ├── package-lock.json            ← Dependency lock file
│   ├── vite.config.js               ← Vite configuration with React
│   └── index.html                   ← HTML entry point
│
├── 🎮 Game Source Code
│   └── src/
│       ├── main.jsx                 ← React app entry point
│       ├── App.jsx                  ← Main game component (300+ lines)
│       ├── App.css                  ← App styling
│       ├── index.css                ← Global styles
│       │
│       ├── KnightJumpChess.js       ← Core game logic (480+ lines) ⭐
│       ├── test.js                  ← Game logic tests (216 lines)
│       ├── usage-examples.js        ← Example usage
│       │
│       ├── components/
│       │   └── ChessBoard.jsx       ← Board display component (180+ lines)
│       │
│       └── styles/
│           └── ChessBoard.css       ← Board component styling
│
└── 📦 Dependencies (installed via npm)
    └── node_modules/                ← All npm packages

```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (one-time setup)
npm install

# Start development server (keep running while coding)
npm run dev
# → Opens http://localhost:5173 automatically

# Run game logic tests
npm test
# → Verifies all game rules work correctly

# Build for production (when ready to deploy)
npm run build

# Preview production build locally
npm run preview
```

---

## 📚 Documentation Map

| Document | Purpose | Read When |
|----------|---------|-----------|
| **README.md** | Original project description | Understanding the game rules |
| **COMPLETION_SUMMARY.md** | What was accomplished in Phase 1 | Celebrating! Getting overview |
| **PHASE1_README.md** | Quick status & file structure | Quick reference |
| **PHASE1_COMPLETE.md** | Detailed breakdown of what was built | Deep dive into implementation |
| **PHASE2_GUIDE.md** | Planning for UI enhancements | Starting Phase 2 development |
| **GAMEPLAY_GUIDE.md** | How to play the game | Learning to play |
| **DEVELOPMENT_GUIDE.md** | Code structure, debugging tips | When coding or debugging |
| **This File** | Project index & quick reference | Navigating the project |

---

## 💻 Source Code Guide

### Game Logic (`src/KnightJumpChess.js`)
The heart of the application. Extends chess.js with jump mechanics.

**Key Methods**:
- `isNearKnight(square, color)` - Detects if piece can jump
- `generateJumpMoves(options)` - Creates jump moves
- `moves(options)` - Returns all legal moves (standard + jumps)
- `move(move, options)` - Executes a move

**Supporting Methods**:
- `generatePawnJumps(fromSquare, color)` - Jump logic for pawns
- `generateRookJumps(fromSquare, color)` - Jump logic for rooks
- `generateBishopJumps(fromSquare, color)` - Jump logic for bishops
- `generateQueenJumps(fromSquare, color)` - Jump logic for queens
- `generateKingJumps(fromSquare, color)` - Jump logic for kings
- `getKnightsOnBoard()` - Finds all knights on board

**Compatibility**:
- `_pieceKey()` override - Ensures BigInt compatibility with chess.js
- `put()`, `remove()`, `clear()` overrides - Maintain internal state

---

### React App (`src/App.jsx`)
Main application component managing game state and user interaction.

**State Variables**:
- `game` - Current game instance (KnightJumpChess)
- `moveHistory` - Array of moves made
- `selectedSquare` - Currently selected piece
- `legalMoves` - Legal moves for selected piece

**Key Functions**:
- `handleSquareClick(square)` - Handles user clicks
- `makeMove(from, to)` - Executes moves
- `resetGame()` - Starts new game
- `undoMove()` - Reverts last move (scaffolding)
- `gameStatus()` - Returns current game state text

**UI Elements**:
- Header with title
- Chessboard component
- Game status panel
- Game controls (New Game, Undo)
- Move history panel
- Game information section
- Footer

---

### Board Component (`src/components/ChessBoard.jsx`)
Displays the chess board and handles visual feedback.

**Features**:
- Uses react-chessboard library
- Custom square styling for:
  - Selected piece (yellow)
  - Legal moves (green)
  - Capture moves (red)
  - Knight zones (dashed border)
- Legend explaining colors
- `getKnightZones(game)` function - Visualizes jump zones

**Props**:
- `game` - Current game instance
- `selectedSquare` - Currently selected square
- `legalMoves` - Available moves
- `onSquareClick` - Click handler

---

### Styling
Three CSS files work together:

1. **index.css** - Global styles
   - Body background
   - Layout structure
   - Header and footer
   - Responsive design
   - Button styling

2. **App.css** - App-specific theme
   - Gradient backgrounds
   - Container styling

3. **ChessBoard.css** - Board component
   - Board card styling
   - Legend styling
   - Square colors

---

### Tests (`src/test.js`)
Comprehensive test suite validating game logic.

**Test Categories**:
1. Knight proximity detection
2. Rook jumping mechanics
3. Pawn jumping mechanics
4. King jumping mechanics
5. Bishop jumping mechanics
6. No jumps without knight nearby
7. Enemy knight doesn't enable jumps
8. Friendly knight enables jumps
9. Multiple landing options

**Run Tests**:
```bash
npm test
```

All tests pass ✅

---

## 🔧 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.2.0 | UI components |
| **Build Tool** | Vite | 5.0.0 | Fast builds & dev server |
| **Vite Plugin** | @vitejs/plugin-react | 4.0.0 | JSX support |
| **Board Display** | react-chessboard | 3.2.0 | Chess board UI |
| **Chess Logic** | chess.js | 1.0.0-beta.8 | Game rules & move validation |
| **Networking** | socket.io-client | 4.5.0 | Real-time multiplayer (Phase 3) |
| **Styling** | Plain CSS | - | No framework overhead |
| **Language** | JavaScript (ES6) | - | Modern syntax |

---

## 📊 Code Statistics

| Metric | Value |
|--------|-------|
| **Game Logic Lines** | 480+ |
| **React Components** | 2 |
| **CSS Files** | 3 |
| **Documentation Files** | 8 |
| **Total Source Files** | 20+ |
| **Dependencies** | 5 production, 1 dev |
| **Test Cases** | 9 suites |
| **Test Coverage** | All game mechanics |

---

## 🎯 Feature Checklist

### ✅ Implemented (Phase 1)
- [x] Knight jump detection
- [x] Jump move generation
- [x] All piece types supported
- [x] React UI
- [x] Board display
- [x] Move selection
- [x] Legal move highlighting
- [x] Game status display
- [x] Move history
- [x] New game button
- [x] Responsive design
- [x] Test suite

### 📋 Planned (Phase 2)
- [ ] Flip board button
- [ ] Better move notation
- [ ] Animation support
- [ ] Piece promotion modal
- [ ] Resign/Draw buttons
- [ ] Sound effects
- [ ] Multiple piece sets
- [ ] Board themes

### 🔜 Future (Phase 3+)
- [ ] Backend server
- [ ] Real-time multiplayer
- [ ] User accounts
- [ ] Game history
- [ ] Rating system
- [ ] Matchmaking
- [ ] Tournaments
- [ ] Mobile app

---

## 🐛 Debugging Checklist

**Game Logic Issues**:
1. Run `npm test` to verify core logic
2. Check KnightJumpChess.js for errors
3. Test with simple positions first

**UI Issues**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify CSS imports in components
4. Restart dev server: Stop `npm run dev`, run again

**Move Issues**:
1. Verify piece selection works
2. Check that legal moves highlight
3. Test in console: `game.moves()`
4. Verify chess.js is installed: `npm list chess.js`

**Performance Issues**:
1. Dev server should start in ~1.3 seconds
2. Hot reload should be ~200ms
3. Moves calculate in <100ms
4. If slow, check browser extensions or CPU usage

---

## 🎓 Learning Resources

**For Understanding the Code**:
- Read DEVELOPMENT_GUIDE.md for code structure
- Check KnightJumpChess.js comments
- Review App.jsx for React patterns
- Look at test.js for game logic examples

**For Game Rules**:
- Read README.md for variant rules
- Check GAMEPLAY_GUIDE.md for how to play
- Review test cases for edge cases

**For Web Development**:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Chess.js GitHub](https://github.com/jhlywa/chess.js)
- [react-chessboard NPM](https://www.npmjs.com/package/react-chessboard)

---

## 🚀 Development Workflow

### Daily Development

```bash
# 1. Start dev server (keep running)
npm run dev

# 2. Open code in editor
code .

# 3. Edit files in src/ folder
# → Changes auto-reload in browser

# 4. Test new features
# → Open http://localhost:5173 and play

# 5. Run tests if you changed game logic
npm test

# 6. Commit changes to git
git add .
git commit -m "Description"
```

### Adding New Features

1. **Plan** - Check PHASE2_GUIDE.md for ideas
2. **Edit** - Modify relevant source files
3. **Test** - Play the game, check console
4. **Refine** - Improve based on testing
5. **Document** - Update comments if needed
6. **Commit** - Save to git

### Deploying (When Ready)

```bash
# Build optimized version
npm run build

# Creates dist/ folder with production files
# Upload to hosting service (Phase 3 guide)
```

---

## 📞 Support & Questions

**Common Issues**:
- See DEVELOPMENT_GUIDE.md
- Check GAMEPLAY_GUIDE.md
- Review code comments in source files
- Run tests: `npm test`

**Next Steps**:
- Start Phase 2: Read PHASE2_GUIDE.md
- Pick a feature to implement
- Follow the recommended order
- Commit changes regularly

---

## 🎉 You're All Set!

Everything you need to:
- ✅ Play the game
- ✅ Understand the code
- ✅ Continue development
- ✅ Debug issues
- ✅ Deploy when ready

**Start Here**:
1. Run `npm run dev`
2. Open http://localhost:5173
3. Play a game!
4. Then review PHASE2_GUIDE.md for next features

Enjoy building! 🚀

---

**Last Updated**: January 30, 2026
**Phase**: 1 Complete
**Status**: Ready for Phase 2 Development
