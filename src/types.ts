export interface Player {
  id: string;
  name: string;
  position: number;
  color: string;
}

export interface Card {
  id: string;
  type: 'green' | 'orange' | 'pink' | 'yellow';
  question?: string; // Made optional
  options?: readonly string[];
  correctAnswer?: string;
  task?: string; // Added as optional
}

export interface GameState {
  hasWon: boolean;
  winner: Player | null;
  currentCard: Card | null;
  showCard: boolean;
}