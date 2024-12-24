import { Injectable } from '@nestjs/common';

/**
 * Represents the service that provides the default point of the application.
 */
@Injectable()
export class AppService {
  /**
   * Gets the default point of the application.
   * @returns An object containing a message
   */
  defaultPoint(): { message: string } {
    return { message: 'Hello API' };
  }
}
