import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * The AppController class acts as the main entry point for handling
 * HTTP requests for the application's root endpoint, providing
 * methods to handle GET and POST operations.
 */
@Controller('/')
@ApiTags('/api')
export class AppController {
  /**
   * Creates a new instance of the AppController class.
   * @param appService The AppService instance to use for handling requests.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root endpoint.
   * @returns An object containing a message.
   */
  @Get()
  @ApiOperation({
    description: 'public endpoint',
  })
  getUsers(): Promise<unknown> {
    return this.appService.defaultPoint();
  }

  /**
   * Handles POST requests to the root endpoint.
   * @returns An object containing a message.
   */
  @Post()
  @ApiOperation({
    description: 'public endpoint',
  })
  createUser(): Promise<unknown> {
    return this.appService.defaultPoint();
  }
}
