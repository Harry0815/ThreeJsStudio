export interface Card {
  color: 'Red' | 'Black';
  suit: 'Diamonds' | 'Spades' | 'Hearts' | 'Clubs';
  value: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King' | 'Ace';
  getPlayValue: () => number;
}

export const suits: Card['suit'][] = ['Diamonds', 'Spades', 'Hearts', 'Clubs'];
export const values: Card['value'][] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
