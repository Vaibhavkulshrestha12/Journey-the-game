export interface Player {
  id: string;
  name: string;
  position: number;
  color: string;
}

export interface Card {
  id: string;
  type: 'green' | 'orange' | 'pink' | 'yellow';
  question?: string; 
  options?: readonly string[];
  correctAnswer?: string;
  task?: string; 
}

export interface GameState {
  players: Player[];
  hostId: string | null;
  currentPlayerIndex: number;
  gameStarted: boolean;
  hasWon: boolean;
  winner: Player | null;
  currentCard: Card | null;
  showCard: boolean;
}