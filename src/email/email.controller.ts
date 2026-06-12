import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService,
      private readonly authService: AuthService
  ) {}

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
