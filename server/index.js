import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// serving from dist
app.use(express.static(join(__dirname, '../dist')));

const rooms = new Map();

const cards = {
  green: [
    {
      id: 'g1',
      type: 'green',
      question: 'What is the largest ocean on Earth?',
      options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
      correctAnswer: 'Pacific',
    },
    {
      id: 'g2',
      type: 'green',
      question: 'Which sea creature can change its color to match its surroundings?',
      options: ['Octopus', 'Shark', 'Dolphin', 'Whale'],
      correctAnswer: 'Octopus',
    },
  ],
  orange: [
    {
      id: 'o1',
      type: 'orange',
      task: 'Pretend to swim like a fish for 10 seconds!',
    },
    {
      id: 'o2',
      type: 'orange',
      task: 'Make your best whale sound!',
    },
  ],
  pink: [
    {
      id: 'p1',
      type: 'pink',
      question: 'Name three types of sea creatures that start with the letter "S".',
      task: 'You have 10 seconds!',
    },
    {
      id: 'p2',
      type: 'pink',
      question: 'What sound does a dolphin make?',
      task: 'Show us your best impression!',
    },
  ],
  yellow: [
    {
      id: 'y1',
      type: 'yellow',
      task: 'Skip like a happy sailor for 5 seconds!',
    },
    {
      id: 'y2',
      type: 'yellow',
      task: 'Pretend to row a boat while singing "Row, Row, Row Your Boat"!',
    },
  ],
};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createGameState() {
  return {
    players: [],
    hostId: null,
    currentPlayerIndex: 0,
    gameStarted: false,
    hasWon: false,
    winner: null,
    currentCard: null,
    showCard: false
  };
}

function getIslandColor(position) {
  const colors = ['green', 'orange', 'pink', 'yellow', 'white'];
  return colors[position % colors.length];
}

function drawCard(color) {
  if (!cards[color] || color === 'white') return null;
  const cardSet = cards[color];
  const randomIndex = Math.floor(Math.random() * cardSet.length);
  return cardSet[randomIndex];
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('createRoom', (callback) => {
    const roomCode = generateRoomCode();
    const gameState = createGameState();
    gameState.hostId = socket.id;
    rooms.set(roomCode, gameState);
    socket.join(roomCode);
    callback(roomCode);
  });

  socket.on('joinRoom', ({ roomCode, playerName }, callback) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      callback({ error: 'Room not found' });
      return;
    }

    if (room.players.length >= 6) {
      callback({ error: 'Room is full' });
      return;
    }

    if (room.gameStarted) {
      callback({ error: 'Game already started' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      position: 0,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'][room.players.length]
    };

    room.players.push(player);
    socket.join(roomCode);
    
    io.to(roomCode).emit('playerJoined', { 
      players: room.players,
      hostId: room.hostId
    });
    
    callback({ 
      success: true, 
      player, 
      gameState: room,
      isHost: socket.id === room.hostId
    });
  });

  socket.on('startGame', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && socket.id === room.hostId && room.players.length >= 2) {
      room.gameStarted = true;
      io.to(roomCode).emit('gameStarted', room);
    }
  });

  socket.on('rollDice', ({ roomCode, playerId }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer.id !== playerId) return;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    const newPosition = Math.min(32, currentPlayer.position + diceValue);
    currentPlayer.position = newPosition;

    const nextPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
    const nextPlayerId = room.players[nextPlayerIndex].id;

    if (newPosition >= 32) {
      room.hasWon = true;
      room.winner = currentPlayer;
      io.to(roomCode).emit('gameWon', { winner: currentPlayer });
    } else {
      room.currentPlayerIndex = nextPlayerIndex;
      const color = getIslandColor(newPosition);
      const card = drawCard(color);
      
      io.to(roomCode).emit('diceRolled', {
        playerId,
        diceValue,
        newPosition,
        nextPlayerId,
        card
      });
    }
  });

  socket.on('completeCard', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    io.to(roomCode).emit('cardCompleted');
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (socket.id === room.hostId && room.players.length > 0) {
          room.hostId = room.players[0].id;
        }
        
        if (room.players.length === 0) {
          rooms.delete(roomCode);
        } else {
          if (playerIndex <= room.currentPlayerIndex) {
            room.currentPlayerIndex = room.currentPlayerIndex % room.players.length;
          }
          
          io.to(roomCode).emit('playerLeft', {
            players: room.players,
            leftPlayerId: socket.id,
            newHostId: room.hostId
          });
        }
      }
    });
  });
});


app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});