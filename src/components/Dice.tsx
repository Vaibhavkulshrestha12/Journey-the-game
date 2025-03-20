import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  onRoll: (value: number) => void;
  isRolling: boolean;
  disabled?: boolean;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function Dice({ onRoll, isRolling, disabled }: DiceProps) {
  const [currentValue, setCurrentValue] = useState(1);

  const handleRoll = () => {
    if (isRolling || disabled) return;
    
    const rollDuration = 1000;
    const framesPerSecond = 10;
    const totalFrames = (rollDuration / 1000) * framesPerSecond;
    let frame = 0;

    const rollInterval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setCurrentValue(randomValue);
      frame++;

      if (frame >= totalFrames) {
        clearInterval(rollInterval);
        onRoll(randomValue);
      }
    }, 1000 / framesPerSecond);
  };

  const DiceIcon = diceIcons[currentValue - 1];

  return (
    <Button
      onClick={handleRoll}
      disabled={isRolling || disabled}
      variant="outline"
      size="lg"
      className={`p-4 ${isRolling ? 'animate-bounce' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <DiceIcon className="w-8 h-8" />
    </Button>
  );
}