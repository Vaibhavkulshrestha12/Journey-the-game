
import { createContext, useEffect, useState, useCallback } from 'react';
import { Player, Card } from '@/types';
import { useAudio } from '@/hooks/use-audio';

import { io } from 'socket.io-client';


const SOCKET_URL = import.meta.env.PROD 
  ? 'journey-the-game-production.up.railway.app' 
  : 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true
});

export interface SocketContextType {
  roomCode: string | null;
  createRoom: () => Promise<string>;
  joinRoom: (roomCode: string, playerName: string) => Promise<{ success: boolean; error?: string }>;
  startGame: () => void;
  rollDice: () => void;
  currentPlayer: Player | null;
  players: Player[];
  gameStarted: boolean;
  isHost: boolean;
  currentTurn: string | null;
  currentCard: Card | null;
  showCard: boolean;
  hasWon: boolean;
  winner: Player | null;
  handleCardComplete: () => void;
}

interface JoinRoomResponse {
  error?: string;
  player?: Player;
  gameState?: {
    players: Player[];
  };
  isHost?: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  roomCode: null,
  createRoom: async () => '',
  joinRoom: async () => ({ success: false }),
  startGame: () => {},
  rollDice: () => {},
  currentPlayer: null,
  players: [],
  gameStarted: false,
  isHost: false,
  currentTurn: null,
  currentCard: null,
  showCard: false,
  hasWon: false,
  winner: null,
  handleCardComplete: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const playWinSound = useAudio('/sounds/win.mp3', 0.5);

  const handleGameWon = useCallback(({ winner: gameWinner }: { winner: Player }) => {
    setHasWon(true);
    setWinner(gameWinner);
    playWinSound();
  }, [playWinSound]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('playerJoined', ({ players: updatedPlayers, hostId }) => {
      setPlayers(updatedPlayers);
      if (socket.id === hostId) {
        setIsHost(true);
      }
    });

    socket.on('gameStarted', (gameState) => {
      setGameStarted(true);
      setPlayers(gameState.players);
      setCurrentTurn(gameState.players[0].id);
    });

    socket.on('diceRolled', ({ playerId, newPosition, nextPlayerId, card }) => {
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { ...p, position: newPosition } : p
      ));
      setCurrentTurn(nextPlayerId);
      if (card) {
        setCurrentCard(card);
        setShowCard(true);
      }
    });

    socket.on('gameWon', handleGameWon);

    socket.on('playerLeft', ({ players: updatedPlayers, newHostId }) => {
      setPlayers(updatedPlayers);
      if (socket.id === newHostId) {
        setIsHost(true);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('diceRolled');
      socket.off('gameWon');
      socket.off('playerLeft');
    };
  }, [handleGameWon]);

  const createRoom = async () => {
    return new Promise<string>((resolve) => {
      socket.emit('createRoom', (roomCode: string) => {
        setRoomCode(roomCode);
        setIsHost(true);
        resolve(roomCode);
      });
    });
  };

  const joinRoom = async (code: string, playerName: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      socket.emit('joinRoom', { roomCode: code, playerName }, (response: JoinRoomResponse) => {
        if (response.error) {
          resolve({ success: false, error: response.error });
          return;
        }

        if (response.player && response.gameState) {
          setRoomCode(code);
          setCurrentPlayer(response.player);
          setPlayers(response.gameState.players);
          setIsHost(response.isHost || false);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Invalid server response' });
        }
      });
    });
  };

  const startGame = () => {
    if (!roomCode || !isHost) return;
    socket.emit('startGame', { roomCode });
  };

  const rollDice = () => {
    if (!currentPlayer || !roomCode || currentPlayer.id !== currentTurn) return;
    socket.emit('rollDice', { roomCode, playerId: currentPlayer.id });
  };

  const handleCardComplete = () => {
    if (!roomCode) return;
    socket.emit('completeCard', { roomCode });
    setShowCard(false);
    setCurrentCard(null);
  };

  return (
    <SocketContext.Provider
      value={{
        roomCode,
        createRoom,
        joinRoom,
        startGame,
        rollDice,
        currentPlayer,
        players,
        gameStarted,
        isHost,
        currentTurn,
        currentCard,
        showCard,
        hasWon,
        winner,
        handleCardComplete,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}