import { Controller, Post, Body, Header, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { EmailDto } from './dto/Email.dto';
import { ResetDto } from './dto/Reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto.email, dto.password);
  }

  // @Post('reset-passord')
  // reset_passeord(@Body() dto: reset_passeord_dto) {
  //     return this.authService.reset_passeord(dto.old_password, dto.new_password);
  // }
  @Post('forgot-password')
  async forgotPassword(@Body() EmailDto: EmailDto) {
    await this.authService.forgotPassword(EmailDto.email);

    return { message: 'check your email to reset the password' };
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() ResetDto: ResetDto,
  ) {
    await this.authService.resetPassword(token, ResetDto.password);
    return { messege: 'the password get udated successfully' };
  }

  @Post('delete-account')
  async deleteaccount(@Body() EmailDto: EmailDto) {
    await this.authService.deleteacoount(EmailDto.email);

    return { message: 'check your email to delete account' };
  }

  @Post('deleting-account')
   async deleting_password(
    @Query('token') token: string,
  ) {
    await this.authService.deleting_account(token);
    return { messege: 'the account has been deleted successfully' };
  }
}
