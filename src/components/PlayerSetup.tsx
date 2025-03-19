import { useContext, useState } from 'react';
import { GameContext } from '@/context/GameContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PlayerSetup() {
  const { players, addPlayer, startGame, gameStarted } = useContext(GameContext);
  const [playerName, setPlayerName] = useState('');
  const [showDialog, setShowDialog] = useState(!gameStarted);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      addPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      startGame();
      setShowDialog(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Player Setup</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Player Name</Label>
            <div className="flex gap-2">
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name"
              />
              <Button onClick={handleAddPlayer}>Add</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Current Players</Label>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-2 bg-gray-100 rounded"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span>{player.name}</span>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={handleStartGame}
            disabled={players.length < 2}
            className="w-full"
          >
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}