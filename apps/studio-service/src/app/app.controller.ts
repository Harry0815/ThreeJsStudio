import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('/')
@ApiTags('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    description: 'public endpoint',
  })
  getUsers(): { message: string } {
    return this.appService.defaultPoint();
  }

  @Post()
  @ApiOperation({
    description: 'public endpoint',
  })
  createUser(): { message: string } {
    return this.appService.defaultPoint();
  }
}
