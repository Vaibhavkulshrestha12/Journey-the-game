import { useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpCircle } from 'lucide-react';

export function Instructions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to Play "The Journey"</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Game Setup</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>2-6 players can participate</li>
                <li>Each player starts at the "Start" position</li>
                <li>Players take turns rolling the dice and moving their token</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Island Colors</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Green: Answer ocean-related questions</li>
                <li>Orange: Perform physical actions</li>
                <li>Pink: Complete creative challenges</li>
                <li>Yellow: Fun movement tasks</li>
                <li>White: Follow the specific instruction on the tile</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How to Win</h3>
              <p>
                Be the first player to reach or pass island 32 (Finish) to win the
                game!
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Tips</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pay attention to the island colors you land on</li>
                <li>Complete all challenges to keep the game moving</li>
                <li>Have fun and be creative with your responses!</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}