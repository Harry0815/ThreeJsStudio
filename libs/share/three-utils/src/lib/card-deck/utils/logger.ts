const LOGGING_ENABLED = process.env['LOGGING_ENABLED'] === 'true';

export const log = (message: string): void => {
  if (LOGGING_ENABLED) {
    console.log(`[CardDeck] ${message}`);
  }
};
