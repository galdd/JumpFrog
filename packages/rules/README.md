# @jumpfrog/rules

Pure TypeScript rules engine for the Hop 'n' Jump game. This package is framework-agnostic and can be used in any JavaScript environment.

## Features

- ✅ Complete game logic implementation
- ✅ Type-safe API with TypeScript
- ✅ Immutable board updates
- ✅ Unit tested with Vitest
- ✅ Zero dependencies
- ✅ Framework-agnostic

## Installation

This is an internal workspace package. In the parent workspace:

```bash
npm install
```

## API Reference

### Types

```typescript
type Player = "GREEN" | "BLACK";
type Coord = { r: number; c: number }; // 0-indexed, r=row, c=column
type Piece = { id: string; owner: Player };
type Board = (Piece | null)[][];

type StepMove = { type: "STEP"; from: Coord; to: Coord };
type JumpMove = { type: "JUMP"; path: Coord[] }; // Length 2 for single jump
type Move = StepMove | JumpMove;
```

### Functions

#### `createInitialBoard(): Board`

Creates a new 8×8 board with frogs in starting positions.

```typescript
const board = createInitialBoard();
// GREEN frogs at A1, B2, C1, D2, E1, F2, G1, H2
// BLACK frogs at A7, B8, C7, D8, E7, F8, G7, H8
```

#### `listLegalMoves(board: Board, player: Player): Move[]`

Returns all legal moves for a player.

```typescript
const moves = listLegalMoves(board, "GREEN");
// Returns array of step and jump moves
// Jump moves only include single hops (path length 2)
```

#### `applyMove(board: Board, move: Move): Board`

Applies a move to the board (immutable - returns new board).

```typescript
const nextBoard = applyMove(board, move);
// Original board is unchanged
```

#### `checkWinner(board: Board): Player | null`

Checks if either player has won.

```typescript
const winner = checkWinner(board);
// Returns "GREEN", "BLACK", or null
```

#### `isDarkSquare(coord: Coord): boolean`

Checks if a coordinate is a dark (playable) square.

```typescript
if (isDarkSquare({ r: 0, c: 1 })) {
  // This is a playable square
}
```

#### `inBounds(coord: Coord): boolean`

Checks if a coordinate is within the 8×8 board.

```typescript
if (inBounds({ r: 7, c: 7 })) {
  // Valid board position
}
```

## Board Coordinate System

The board uses a 0-indexed coordinate system:

- `r` (row): 0 (top) to 7 (bottom)
- `c` (column): 0 (left, file A) to 7 (right, file H)

Chess notation mapping:
- A1 = `{ r: 7, c: 0 }`
- H8 = `{ r: 0, c: 7 }`

## Game Rules

### Playable Squares

Only dark squares (where `(r + c) % 2 === 1`) are playable.

### Moves

**Step Move**: Diagonal move to an adjacent empty dark square (4 possible directions).

**Jump Move**: Diagonal jump over an adjacent piece (any owner) to an empty dark square two spaces away. Returns only single jumps (path length 2). Multi-jump is handled by the UI as sequential moves with a timer.

### Winning

A player wins when all 8 of their frogs occupy the opponent's starting positions:
- GREEN wins: All frogs on A7, B8, C7, D8, E7, F8, G7, H8
- BLACK wins: All frogs on A1, B2, C1, D2, E1, F2, G1, H2

## Testing

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

## Example Usage

```typescript
import {
  createInitialBoard,
  listLegalMoves,
  applyMove,
  checkWinner
} from "@jumpfrog/rules";

// Set up game
let board = createInitialBoard();
let currentPlayer = "GREEN";

// Game loop
while (!checkWinner(board)) {
  const moves = listLegalMoves(board, currentPlayer);
  
  // Player selects a move (implementation dependent)
  const selectedMove = moves[0];
  
  // Apply move
  board = applyMove(board, selectedMove);
  
  // Switch player
  currentPlayer = currentPlayer === "GREEN" ? "BLACK" : "GREEN";
}

console.log(`Winner: ${checkWinner(board)}`);
```

## File Structure

```
packages/rules/src/
├── types.ts       # Type definitions
├── constants.ts   # Board size, starting positions, targets
├── board.ts       # Board creation and validation
├── moves.ts       # Move generation logic
├── game.ts        # Move application and winner detection
└── index.ts       # Public API exports
```

## License

MIT
