import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World x100!';
  }

  gethello2(): string{
    return "how are you"
  }
}
