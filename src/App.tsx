import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/GameBoard';
import { PlayerSetup } from '@/components/PlayerSetup';
import { GameProvider } from '@/context/GameContext';
import { SocketProvider } from '@/context/SocketContext';
import { WaveBackground } from '@/components/WaveBackground';
import { Instructions } from '@/components/Instructions';
import { CardModal } from '@/components/CardModal';
import { WinScreen } from '@/components/WinScreen';
import { RoomSetup } from '@/components/RoomSetup';
import { Ship } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';

function GameWrapper() {
  const [showRoomSetup, setShowRoomSetup] = useState(false);
  const { gameStarted, roomCode } = useSocket();

  if (!showRoomSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
        <WaveBackground />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Ship className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-bold text-white">The Journey</h1>
          </div>
          <p className="text-xl text-white mb-8">
            An ocean adventure board game
          </p>
          <Button
            size="lg"
            onClick={() => setShowRoomSetup(true)}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Start New Game
          </Button>
        </div>
      </div>
    );
  }

  if (!roomCode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
        <WaveBackground />
        <div className="relative z-10 text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Ship className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-bold text-white">The Journey</h1>
          </div>
        </div>
        <RoomSetup onBack={() => setShowRoomSetup(false)} />
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
        <WaveBackground />
        <div className="relative z-10 w-full">
          <PlayerSetup />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <WaveBackground />
      <Instructions />
      <div className="container mx-auto p-4 relative z-10">
        <GameBoard />
        <CardModal />
        <WinScreen />
      </div>
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <GameWrapper />
      </GameProvider>
    </SocketProvider>
  );
}

export default App;