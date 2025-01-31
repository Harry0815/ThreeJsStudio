import { Card } from '../models/card';

export type ShuffleAlgorithm = 'fisher-yates' | 'riffle';

export const fisherYatesShuffle = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const riffleShuffle = (deck: Card[]): Card[] => {
  const cut = Math.floor(deck.length / 2);
  const left = deck.slice(0, cut);
  const right = deck.slice(cut);
  const shuffled: Card[] = [];

  while (left.length || right.length) {
    if (left.length && Math.random() > 0.5) shuffled.push(left.shift()!);
    if (right.length) shuffled.push(right.shift()!);
  }
  return shuffled;
};
