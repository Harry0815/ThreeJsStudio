import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  defaultPoint(): { message: string } {
    return { message: 'Hello API' };
  }
}
