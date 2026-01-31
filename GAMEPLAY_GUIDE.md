# How to Play Knight Jump Chess - Visual Guide

## Getting Started

### Launch the Game
1. Make sure this command is running in a terminal:
   ```bash
   npm run dev
   ```

2. Open your browser to: **http://localhost:5173**

You should see a chess board with a sidebar showing game status and move history.

## Basic Gameplay

### Step 1: Select a Piece
Click on any of your pieces to select it.
- The piece will highlight in **yellow**
- Green squares appear showing where it can move
- The sidebar shows the current game status

### Step 2: Make a Move
Click on a green square to move your piece there.
- Normal moves: Click to land on empty square
- Captures: Click on a red square to capture an enemy piece
- Illegal moves: Simply don't highlight, can't be clicked

### Step 3: See the Result
- Board updates with new position
- Move appears in Move History on the right
- Turn switches to opponent
- Status updates (check, checkmate, etc.)

## Understanding the Colors

| Color | Meaning |
|-------|---------|
| **Yellow** | Your selected piece |
| **Green** | Legal move (empty square) |
| **Red** | Legal capture move |
| **Dashed Border** | Square near a knight (jump zone) |
| **Gray Background** | Regular board square |

## Knight Jump Mechanics Explained

### What Makes a Piece Special?

When your piece is:
- **Adjacent to** a friendly knight, OR
- A **knight's move away** from a friendly knight

It can **jump over one blocking piece** to continue moving!

### Example: Rook Jump

```
Initial Position:     After Knight Jump:
┌─────────────┐       ┌─────────────┐
│ . . . . . . │       │ . . . . . . │
│ . . P . . . │       │ . . . R . . │  ← Rook moved here
│ . R N . . . │       │ . . P . . . │  ← Jumped over pawn
│ . . . . . . │       │ . N . . . . │
└─────────────┘       └─────────────┘
```

- Rook on R position
- Knight (N) is adjacent to rook
- Pawn (P) blocks the path
- Rook jumps over pawn and lands on the square shown
- Rook could continue to other squares in that direction!

### Pieces That Can Jump

- **Rook**: Jump over one piece, then slide straight as far as wanted
- **Bishop**: Jump over one piece, then slide diagonally as far as wanted
- **Queen**: Jump over one piece, then slide straight or diagonal as far as wanted
- **Pawn**: Jump one square forward when blocked (lands two squares ahead)
- **King**: Jump one square in any direction when blocked

### Knight's Special Role

- **Knights do NOT jump** (they're already quick!)
- Knights **ENABLE jumping** for nearby pieces
- Multiple knights = larger jump zones

## Game Controls

### Right Sidebar Controls

**Status Panel**: Shows whose turn it is and any checks/checkmates

**Buttons**:
- **New Game**: Reset to starting position
- **Undo**: Revert to previous move (if available)

**Move History**: Lists all moves made in the game

## Special Game Situations

### Check
- King is under attack
- You MUST move out of check
- Board shows status: "White to move, King in Check"
- Selected piece will be your king

### Checkmate
- King is in check AND
- No legal moves available
- Game ends
- Status shows: "Checkmate! Black wins!"

### Stalemate
- Your turn, king NOT in check
- But you have NO legal moves
- Game ends in draw
- Status shows: "Stalemate - Draw!"

## Tips & Tricks

### Finding Jump Opportunities

1. **Look for dashed border squares** - these are your jump zones
2. **Check what pieces are blocking** - you can only jump if something is in the way
3. **Remember the destination** - after jumping, you can continue moving in that direction

### Strategic Considerations

- **Use multiple knights** - more knights = more pieces can jump
- **Position knights well** - place them near pieces you want to activate
- **Plan ahead** - think about what pieces will be near knights next move
- **Control the center** - knights in the center control more squares

## What Happens When...

### I Click a Square With No Piece?
Nothing happens - empty squares aren't selectable

### I Click an Enemy Piece?
It becomes selected (if it's your turn) - wait, no! The board prevents this.
Only YOUR pieces can be selected when it's your turn.

### I Click the Same Square Twice?
First click: Selects the piece (yellow)
Second click: Deselects it (no highlight)

### I Try an Illegal Move?
The square won't be highlighted in green, so you can't click it.
The UI prevents illegal moves!

### Pawn Reaches the End?
In Phase 2, a modal will appear to choose promotion (Queen recommended).
For now, it auto-promotes to Queen.

## Advanced: Understanding Jump Zones

### Zones are Determined By:

1. **Horizontal/Vertical Squares** (Rook-like)
   - One square left, right, up, down from each knight

2. **Diagonal Squares** (Bishop-like)
   - One square diagonally from each knight

3. **Knight's Move Squares**
   - All L-shaped moves from each knight
   - 2 left + 1 up/down
   - 1 left + 2 up/down
   - etc. (8 possible squares per knight)

So one knight can activate up to 19 different squares!

### Multiple Knights = Larger Zones

```
Single Knight:       Two Knights:
    . . .               . . . . .
    . N .               . N . N .
    . . .               . . . . .
```

The zones overlap, creating more jump opportunities!

## Keyboard Shortcuts (Future Enhancement)

Currently unavailable, but planned for Phase 2:
- **F** - Flip board
- **U** - Undo move
- **N** - New game
- **R** - Resign
- **D** - Offer draw

## Troubleshooting While Playing

### Board Won't Update
- Refresh the page (F5)
- Check that dev server is running: `npm run dev`

### Can't Click Pieces
- Make sure it's YOUR turn (check the status)
- Make sure the piece shown is your color

### Move Didn't Register
- Watch for green highlights to confirm the move was legal
- Try selecting the piece again and confirming

### Game Seems Stuck
- Click "New Game" to start fresh
- Check the game status message for what's happening

## Settings & Preferences

### Coming in Phase 2

- **Flip Board**: Play from black's perspective
- **Board Themes**: Different color schemes
- **Piece Sets**: Different piece styles
- **Sound**: Toggle move sounds
- **Notation**: Different move display styles

For now, just classic chess board!

## Playing Multiple Games

### To Play Again

1. Click **"New Game"** button in the sidebar
2. Board resets to starting position
3. Move history clears
4. White goes first
5. Start playing!

### Loading a Previous Game

Coming in Phase 3 - you'll be able to:
- Save games to your account
- Load and continue previous games
- Share games with others
- Review games after playing

## Competitive Play (Phase 3)

Currently single-device play only. Phase 3 will add:
- **Two-player online** - play friends remotely
- **Matchmaking** - find random opponents
- **Rating system** - track your skill level
- **Tournament mode** - compete in structured play

## More Questions?

See the documentation files:
- **DEVELOPMENT_GUIDE.md** - Technical help
- **PHASE2_GUIDE.md** - What's coming next
- **COMPLETION_SUMMARY.md** - Project overview

Or review the game logic tests to understand the rules better:
```bash
npm test
```

---

## Enjoy the Game! 🎉

You're playing a variant created specifically for this project. Experiment, learn the jump mechanics, and discover new strategies!

Happy playing! ♟️♗♘
