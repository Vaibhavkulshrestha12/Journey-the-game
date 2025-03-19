import { createContext, useState, ReactNode, useEffect } from 'react';
import { Player, Card, GameState } from '@/types';
import { cards } from '@/data/cards';
import useSound from 'use-sound';

interface GameContextType {
  players: Player[];
  currentPlayer: Player | null;
  gameStarted: boolean;
  isRolling: boolean;
  gameState: GameState;
  currentCard: Card | null;
  showCard: boolean;
  addPlayer: (name: string) => void;
  startGame: () => void;
  rollDice: (value: number) => void;
  handleCardComplete: () => void;
  resetGame: () => void;
}

export const GameContext = createContext<GameContextType>({
  players: [],
  currentPlayer: null,
  gameStarted: false,
  isRolling: false,
  gameState: {
    hasWon: false,
    winner: null,
    currentCard: null,
    showCard: false,
  },
  currentCard: null,
  showCard: false,
  addPlayer: () => {},
  startGame: () => {},
  rollDice: () => {},
  handleCardComplete: () => {},
  resetGame: () => {},
});

const PLAYER_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
];

const initialGameState: GameState = {
  hasWon: false,
  winner: null,
  currentCard: null,
  showCard: false,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playMoveSound] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWinSound] = useSound('/sounds/win.mp3', { volume: 0.5 });

  const addPlayer = (name: string) => {
    if (players.length < 6) {
      setPlayers([
        ...players,
        {
          id: crypto.randomUUID(),
          name,
          position: 0,
          color: PLAYER_COLORS[players.length],
        },
      ]);
    }
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
    }
  };

  const drawCard = (color: keyof typeof cards) => {
    const cardSet = cards[color];
    const randomIndex = Math.floor(Math.random() * cardSet.length);
    return cardSet[randomIndex];
  };

  const handleCardComplete = () => {
    setGameState((prev) => ({
      ...prev,
      showCard: false,
      currentCard: null,
    }));
  };

  const checkWinCondition = (position: number, player: Player) => {
    if (position >= 32) {
      playWinSound();
      setGameState((prev) => ({
        ...prev,
        hasWon: true,
        winner: player,
      }));
      return true;
    }
    return false;
  };

  const rollDice = (value: number) => {
    setIsRolling(true);
    setTimeout(() => {
      setPlayers((currentPlayers) =>
        currentPlayers.map((player, index) => {
          if (index === currentPlayerIndex) {
            const newPosition = Math.min(32, player.position + value);
            playMoveSound();
            
            const updatedPlayer = { ...player, position: newPosition };
            
            if (!checkWinCondition(newPosition, updatedPlayer)) {
              const color = getIslandColor(newPosition);
              if (color !== 'white') {
                const card = drawCard(color as keyof typeof cards);
                setGameState((prev) => ({
                  ...prev,
                  currentCard: card,
                  showCard: true,
                }));
              }
            }
            
            return updatedPlayer;
          }
          return player;
        })
      );
      setCurrentPlayerIndex((current) => (current + 1) % players.length);
      setIsRolling(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setGameStarted(false);
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        currentPlayer: players[currentPlayerIndex] || null,
        gameStarted,
        isRolling,
        gameState,
        currentCard: gameState.currentCard,
        showCard: gameState.showCard,
        addPlayer,
        startGame,
        rollDice,
        handleCardComplete,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

function getIslandColor(position: number) {
  const colors = ['green', 'orange', 'pink', 'yellow', 'white'];
  return colors[position % colors.length];
}