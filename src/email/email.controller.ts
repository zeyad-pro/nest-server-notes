import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    console.log('token', token);
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Query('token') token: string) {
    return this.emailService.resendVerification(token);
  }
}
