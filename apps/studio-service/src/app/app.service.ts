import { Injectable } from '@nestjs/common';
import { tusTestService } from './tus-test.service';

/**
 * Represents the service that provides the default point of the application.
 */
@Injectable()
export class AppService {
  /**
   * Initializes a new instance of the class with the provided tusTestService.
   *
   * @param {tusTestService} tusService - An instance of the tusTestService to be used.
   */
  constructor(private readonly tusService: tusTestService) {}

  /**
   * Returns the default point object with a predefined message.
   *
   * @returns {Promise<unknown>} A promise that resolves with the default point object.
   */
  async defaultPoint(): Promise<unknown> {
    return await this.tusService.uploadFile('README.md', 'http://localhost:3002/api/uploads');
  }
}
