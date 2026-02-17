# JumpFrog

A real-time multiplayer board game built with React and Node.js. JumpFrog is a browser-based implementation of **Hop 'n' Jump** (Kafitz-Kafutz) — a strategic frog-hopping game on an 8x8 checkerboard.

Play against a friend online or challenge the built-in AI bot locally.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Client** | React 19, TypeScript, Vite, Framer Motion, CSS Modules |
| **Server** | Node.js, Express, Socket.IO, TypeScript |
| **Shared** | Pure TypeScript game engine, Socket.IO protocol types |
| **Testing** | Vitest |
| **Tooling** | pnpm workspaces, ESLint |

## Project Structure

```
jumpfrog/
├── apps/
│   ├── client/             # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── ai/         # Minimax AI bot
│   │   │   ├── anim/       # Sprite animation & SFX
│   │   │   ├── components/ # UI components (Board, Menu, Settings, etc.)
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── i18n/       # Internationalization
│   │   │   ├── net/        # Socket.IO client
│   │   │   ├── types/      # Client-specific types
│   │   │   └── utils/      # Helper functions
│   │   └── index.html
│   └── server/             # Express + Socket.IO backend
│       └── src/
│           ├── game/       # Room management & move handling
│           └── index.ts    # Server entry point
├── packages/
│   ├── rules/              # Game engine (framework-agnostic)
│   │   ├── src/            # Board, moves, win conditions
│   │   └── test/           # Unit tests
│   └── shared/             # Socket.IO protocol types
└── pnpm-workspace.yaml
```

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- [pnpm](https://pnpm.io/) v9 or higher

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/JumpFrog.git
cd JumpFrog

# Install dependencies
pnpm install

# Start the backend server (port 4000)
pnpm dev:server

# In a separate terminal, start the client (port 5173)
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the client dev server |
| `pnpm dev:server` | Start the backend dev server |
| `pnpm build` | Build the client for production |
| `pnpm build:server` | Build the server for production |
| `pnpm test` | Run game rules unit tests |
| `pnpm lint` | Lint the client codebase |

## Environment Variables

### Client (`apps/client/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_SERVER_URL` | `http://localhost:4000` | Backend server URL |

### Server (`apps/server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `WEB_ORIGIN` | `http://localhost:5173` | Allowed CORS origin(s), comma-separated |

See `.env.example` files in each app directory for reference.

## Game Rules

- **Board**: 8x8 checkerboard — only dark squares are playable
- **Players**: GREEN vs BLACK, 8 frogs each
- **Moves**:
  - **Step** — move diagonally to an adjacent empty square
  - **Jump** — leap diagonally over any adjacent piece to an empty square beyond it
  - **Chain jump** — after a jump, the same frog can jump again within 5 seconds
- **No captures** — jumped pieces stay on the board
- **Win condition** — get all 8 frogs to your opponent's starting positions

## License

[MIT](LICENSE)
