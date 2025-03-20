import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, GameState, Card } from '@/types';
import useSound from 'use-sound';

interface SocketContextType {
  socket: Socket | null;
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

const SocketContext = createContext<SocketContextType>({
  socket: null,
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

export const useSocket = () => useContext(SocketContext);

// Get the server URL based on environment
const getServerUrl = () => {
  if (import.meta.env.PROD) {
    // Replace this with your actual production server URL
    return 'https://journey-the-game.vercel.app/';
  }
  return 'http://localhost:3001';
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
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
  const [playWinSound] = useSound('/sounds/win.mp3', { volume: 0.5 });

  useEffect(() => {
    const newSocket = io(getServerUrl());
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('playerJoined', ({ players, hostId }) => {
      setPlayers(players);
      setIsHost(socket.id === hostId);
    });

    socket.on('gameStarted', (gameState: GameState) => {
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

    socket.on('gameWon', ({ winner }) => {
      setHasWon(true);
      setWinner(winner);
      playWinSound();
    });

    socket.on('playerLeft', ({ players, leftPlayerId, newHostId }) => {
      setPlayers(players);
      if (socket.id === newHostId) {
        setIsHost(true);
      }
      if (currentTurn === leftPlayerId) {
        setCurrentTurn(players[0]?.id || null);
      }
    });

    socket.on('cardCompleted', () => {
      setShowCard(false);
      setCurrentCard(null);
    });

    return () => {
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('diceRolled');
      socket.off('gameWon');
      socket.off('playerLeft');
      socket.off('cardCompleted');
    };
  }, [socket, currentTurn, playWinSound]);

  const createRoom = async () => {
    if (!socket) return '';
    return new Promise<string>((resolve) => {
      socket.emit('createRoom', (roomCode: string) => {
        setRoomCode(roomCode);
        setIsHost(true);
        resolve(roomCode);
      });
    });
  };

  const joinRoom = async (roomCode: string, playerName: string) => {
    if (!socket) return { success: false };
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      socket.emit('joinRoom', { roomCode, playerName }, (response: any) => {
        if (response.success) {
          setRoomCode(roomCode);
          setCurrentPlayer(response.player);
          setPlayers(response.gameState.players);
          setIsHost(response.isHost);
        }
        resolve(response);
      });
    });
  };

  const startGame = () => {
    if (!socket || !roomCode || !isHost) return;
    socket.emit('startGame', { roomCode });
  };

  const rollDice = () => {
    if (!socket || !roomCode || !currentPlayer || currentPlayer.id !== currentTurn) return;
    socket.emit('rollDice', { roomCode, playerId: currentPlayer.id });
  };

  const handleCardComplete = () => {
    if (!socket || !roomCode) return;
    socket.emit('completeCard', { roomCode });
    setShowCard(false);
    setCurrentCard(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
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