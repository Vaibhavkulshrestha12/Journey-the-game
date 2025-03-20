import { useSocket } from '@/context/SocketContext';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useSound from 'use-sound';

export function WinScreen() {
  const { hasWon, winner } = useSocket();
  const [playWinSound] = useSound('/sounds/win.mp3', { volume: 0.5 });

  if (!hasWon || !winner) return null;

  return (
    <Dialog open={hasWon}>
      <DialogContent className="bg-gradient-to-b from-blue-500 to-blue-700 border-4 border-yellow-400">
        <Confetti />
        <DialogHeader>
          <DialogTitle className="text-3xl text-white text-center">
            🎉 Congratulations! 🎉
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6 text-center text-white"
        >
          <p className="text-xl">
            {winner.name} has won the game!
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 text-blue-700 hover:bg-yellow-300"
            onClick={() => {
              playWinSound();
              window.location.reload();
            }}
          >
            Play Again
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}