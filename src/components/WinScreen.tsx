import { useContext } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GameContext } from '@/context/GameContext';
import useSound from 'use-sound';

export function WinScreen() {
  const { gameState, resetGame } = useContext(GameContext);
  const [playWinSound] = useSound('/sounds/win.mp3', { volume: 0.5 });

  if (!gameState.hasWon || !gameState.winner) return null;

  return (
    <Dialog open={gameState.hasWon} onOpenChange={() => resetGame()}>
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
            {gameState.winner.name} has won the game!
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 text-blue-700 hover:bg-yellow-300"
            onClick={() => {
              playWinSound();
              resetGame();
            }}
          >
            Play Again
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}