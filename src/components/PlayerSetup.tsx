import { useSocket } from '@/hooks/useSocket';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PlayerSetup() {
  const { players, startGame, roomCode, isHost } = useSocket();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Room Code: {roomCode}</h2>
          <p className="text-gray-600 mb-4">
            Share this code with other players to join the game.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Players in Room:</h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-2 p-2 bg-gray-100 rounded"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span>{player.name}</span>
                {index === 0 && <span className="text-sm text-blue-600">(Host)</span>}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <Button
            onClick={startGame}
            disabled={players.length < 2}
            className="w-full"
          >
            {players.length < 2
              ? 'Waiting for more players...'
              : 'Start Game'}
          </Button>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            Waiting for host to start the game...
          </div>
        )}

        <p className="text-sm text-gray-500 text-center">
          {players.length < 2
            ? 'At least 2 players are required to start the game'
            : isHost
            ? 'All players are ready!'
            : 'Game will start when the host is ready'}
        </p>
      </div>
    </Card>
  );
}