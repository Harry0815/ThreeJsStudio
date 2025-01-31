/**
 * Represents a custom error type for handling card deck-related errors.
 * Extends the built-in Error class to provide additional context
 * and differentiation from general errors.
 *
 * The `CardDeckError` is intended to handle errors specific to operations
 * within a card deck system and can be used to throw or catch such errors
 * exclusively.
 *
 * @class
 * @extends Error
 * @param {string} message - A descriptive error message providing additional context about the error.
 */
export class CardDeckError extends Error {
  /**
   *
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = 'CardDeckError';
  }
}
