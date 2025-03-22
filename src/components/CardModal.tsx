import { useSocket } from '@/context/SocketContext';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/hooks/use-audio';

const colorStyles = {
  green: 'bg-green-100 border-green-500',
  orange: 'bg-orange-100 border-orange-500',
  pink: 'bg-pink-100 border-pink-500',
  yellow: 'bg-yellow-100 border-yellow-500',
};

export function CardModal() {
  const { currentCard, showCard, handleCardComplete } = useSocket();
  const playCardSound = useAudio('/sounds/card-flip.mp3', 0.5);

  if (!currentCard || !showCard) return null;

  return (
    <Dialog open={showCard} onOpenChange={() => handleCardComplete()}>
      <DialogContent className={`${colorStyles[currentCard.type]} border-4`}>
        <DialogHeader>
          <DialogTitle className="text-2xl capitalize">{currentCard.type} Card</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          {currentCard.question && (
            <p className="text-lg font-medium">{currentCard.question}</p>
          )}
          {currentCard.task && (
            <p className="text-lg font-medium">{currentCard.task}</p>
          )}
          {currentCard.options && (
            <div className="grid grid-cols-2 gap-2">
              {currentCard.options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => {
                    playCardSound();
                    handleCardComplete();
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
          <Button
            className="w-full"
            onClick={() => {
              playCardSound();
              handleCardComplete();
            }}
          >
            Complete Challenge
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}