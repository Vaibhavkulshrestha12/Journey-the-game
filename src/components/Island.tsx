import { Card } from '@/components/ui/card';
import { Player } from '@/types';

interface IslandProps {
  position: number;
  color: string;
  players: Player[];
}

const colorMap = {
  green: 'bg-green-200 hover:bg-green-300',
  orange: 'bg-orange-200 hover:bg-orange-300',
  pink: 'bg-pink-200 hover:bg-pink-300',
  yellow: 'bg-yellow-200 hover:bg-yellow-300',
  white: 'bg-white hover:bg-gray-100',
};

export function Island({ position, color, players }: IslandProps) {
  return (
    <Card
      className={`${
        colorMap[color as keyof typeof colorMap]
      } p-4 aspect-square flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer`}
    >
      <span className="text-lg font-bold">{position}</span>
      {players.length > 0 && (
        <div className="absolute top-0 left-0 w-full flex justify-center -translate-y-1/2">
          {players.map((player) => (
            <div
              key={player.id}
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: player.color }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}