import { createDeck, shuffle } from './card-deck';

const deck = createDeck();
console.log(deck, deck.length);
shuffle(deck);
console.log(deck, deck.length);
