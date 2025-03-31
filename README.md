# Othello Game

A modern implementation of the classic Othello (Reversi) game built with React and TypeScript.

## Features

- 8x8 game board
- Turn-based gameplay between black and white players
- Visual indicators for valid moves
- Real-time score tracking
- Game over detection
- Winner determination
- Reset game functionality

## Technologies Used

- React
- TypeScript
- Vite
- CSS3

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/n0ndescript/othello.git
cd othello
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## How to Play

1. Black moves first
2. Click on any valid move (indicated by a semi-transparent dot)
3. The game will automatically flip captured pieces
4. Players alternate turns until no more moves are possible
5. The player with the most pieces wins

## Project Structure

```
othello/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx
│   │   └── GameBoard.css
│   ├── types/
│   │   └── game.ts
│   ├── utils/
│   │   └── gameLogic.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
