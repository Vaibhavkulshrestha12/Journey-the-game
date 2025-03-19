export const cards = {
  green: [
    {
      id: 'g1',
      type: 'green',
      question: 'What is the largest ocean on Earth?',
      options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
      correctAnswer: 'Pacific',
    },
    {
      id: 'g2',
      type: 'green',
      question: 'Which sea creature can change its color to match its surroundings?',
      options: ['Octopus', 'Shark', 'Dolphin', 'Whale'],
      correctAnswer: 'Octopus',
    },
  ],
  orange: [
    {
      id: 'o1',
      type: 'orange',
      task: 'Pretend to swim like a fish for 10 seconds!',
    },
    {
      id: 'o2',
      type: 'orange',
      task: 'Make your best whale sound!',
    },
  ],
  pink: [
    {
      id: 'p1',
      type: 'pink',
      question: 'Name three types of sea creatures that start with the letter "S".',
      task: 'You have 10 seconds!',
    },
    {
      id: 'p2',
      type: 'pink',
      question: 'What sound does a dolphin make?',
      task: 'Show us your best impression!',
    },
  ],
  yellow: [
    {
      id: 'y1',
      type: 'yellow',
      task: 'Skip like a happy sailor for 5 seconds!',
    },
    {
      id: 'y2',
      type: 'yellow',
      task: 'Pretend to row a boat while singing "Row, Row, Row Your Boat"!',
    },
  ],
} as const;