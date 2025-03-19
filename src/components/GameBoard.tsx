import { useContext } from 'react';
import { GameContext } from '@/context/GameContext';
//import { Button } from '@/components/ui/button';
import { Dice } from '@/components/Dice';
import { Island } from '@/components/Island';
import { Card } from '@/components/ui/card';

const BOARD_SIZE = 32;

export function GameBoard() {
  const { currentPlayer, players, rollDice, isRolling } = useContext(GameContext);

  const islands = Array.from({ length: BOARD_SIZE }, (_, i) => ({
    id: i + 1,
    color: getIslandColor(i + 1),
  }));

  function getIslandColor(position: number) {
    const colors = ['green', 'orange', 'pink', 'yellow', 'white'];
    return colors[position % colors.length];
  }

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                currentPlayer?.id === player.id
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
        <Dice onRoll={rollDice} isRolling={isRolling} />
      </div>

      <div className="grid grid-cols-8 gap-4 p-4 bg-blue-100 rounded-xl">
        {islands.map((island) => (
          <Island
            key={island.id}
            position={island.id}
            color={island.color}
            players={players.filter((p) => p.position === island.id)}
          />
        ))}
      </div>
    </Card>
  );
}