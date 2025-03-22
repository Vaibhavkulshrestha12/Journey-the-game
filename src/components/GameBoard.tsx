// File: src/components/GameBoard.tsx
import { useSocket } from '@/hooks/useSocket';
import { Dice } from '@/components/Dice';
import { Island } from '@/components/Island';
import { Card } from '@/components/ui/card';
import { Player } from '@/types';

const BOARD_SIZE = 32;

interface IslandData {
  id: number;
  color: string;
}

export function GameBoard() {
  const { currentPlayer, players, rollDice, currentTurn } = useSocket();

  const islands: IslandData[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
    id: i + 1,
    color: getIslandColor(i + 1),
  }));

  function getIslandColor(position: number) {
    const colors = ['green', 'orange', 'pink', 'yellow', 'white'];
    return colors[position % colors.length];
  }

  const currentPlayerName = players.find((p: Player) => p.id === currentTurn)?.name;
  const isCurrentPlayerTurn = currentPlayer?.id === currentTurn;

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {players.map((player: Player) => (
            <div
              key={player.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                player.id === currentTurn
                  ? 'bg-blue-100 ring-2 ring-blue-400'
                  : ''
              }`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <span className="font-medium">{player.name}</span>
              <span className="text-sm text-gray-600">
                Position: {player.position}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-600 mb-2">
            Current Turn: {currentPlayerName}
          </p>
          <Dice onRoll={rollDice} isRolling={false} disabled={!isCurrentPlayerTurn} />
        </div>
      </div>

      <div className="grid grid-cols-8 gap-4 p-4 bg-blue-100 rounded-xl">
        {islands.map((island) => (
          <Island
            key={island.id}
            position={island.id}
            color={island.color}
            players={players.filter((p: Player) => p.position === island.id)}
          />
        ))}
      </div>
    </Card>
  );
}