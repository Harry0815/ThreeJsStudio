import { CardDeckError } from './errors/card-deck-error';
import { Card, suits, values } from './models/card';
import { log } from './utils/logger';
import { fisherYatesShuffle, riffleShuffle, ShuffleAlgorithm } from './utils/shuffler';

let shuffleAlgorithm: ShuffleAlgorithm = 'fisher-yates';

export const createDeck = (): Card[] => {
  log('Creating a new deck...');
  let deck: Card[] = [];
  deck = suits.flatMap((suit) =>
    values.map((value) => ({
      suit,
      value,
      color: suit === 'Hearts' || suit === 'Diamonds' ? 'Red' : 'Black',
      getPlayValue: function (): number {
        if (this.value === 'Jack' || this.value === 'Queen' || this.value === 'King') {
          return 10;
        } else if (this.value === 'Ace') {
          return 1;
        } else {
          return parseInt(this.value);
        }
      },
    })),
  );
  log('Deck created successfully.');
  return [...deck];
};

export const setShuffleAlgorithm = (algorithm: ShuffleAlgorithm): void => {
  shuffleAlgorithm = algorithm;
  log(`Shuffle algorithm set to ${algorithm}.`);
};

export const shuffle = (deck: Card[]): Card[] => {
  log('Shuffling the deck...');
  if (shuffleAlgorithm === 'fisher-yates') {
    fisherYatesShuffle(deck);
  } else {
    riffleShuffle(deck);
  }
  log('Deck shuffled.');
  return deck;
};

export const drawCard = (deck: Card[]): Card | undefined => {
  if (deck.length === 0) throw new CardDeckError('Cannot draw a card from an empty deck.');
  const card = deck.pop();
  log(`Player drew ${toString(card)}.`);
  return card;
};

export const peekCard = (deck: Card[]): Card => {
  if (deck.length === 0) throw new CardDeckError('Cannot peek a card from an empty deck.');
  return deck[deck.length - 1];
};

export const resetDeck = (): Card[] => {
  return createDeck();
};

export const toString = (card: Card | undefined): string => {
  if (!card) return 'undefined';
  return `${card.value} of ${card.suit}`;
};
