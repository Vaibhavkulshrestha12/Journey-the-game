import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface RoomSetupProps {
  onBack: () => void;
}

export function RoomSetup({ onBack }: RoomSetupProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { createRoom, joinRoom } = useSocket();
  const { toast } = useToast();

  const handleCreateRoom = async () => {
    if (!playerName) {
      toast({
        title: 'Error',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }

    const newRoomCode = await createRoom();
    await joinRoom(newRoomCode, playerName);
  };

  const handleJoinRoom = async () => {
    if (!playerName || !roomCode) {
      toast({
        title: 'Error',
        description: 'Please enter your name and room code',
        variant: 'destructive',
      });
      return;
    }

    const response = await joinRoom(roomCode, playerName);
    if (!response.success) {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute left-4 top-4"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <div className="space-y-4 mt-8">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <Input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1"
          />
        </div>

        {isJoining ? (
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700">
              Room Code
            </label>
            <Input
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className="mt-1"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          {!isJoining ? (
            <>
              <Button onClick={handleCreateRoom} className="w-full">
                Create New Room
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsJoining(true)}
                className="w-full"
              >
                Join Existing Room
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleJoinRoom} className="w-full">
                Join Room
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsJoining(false)}
                className="w-full"
              >
                Back
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}