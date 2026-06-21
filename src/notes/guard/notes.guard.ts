import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly usersService: UsersService,) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('no token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_KEY });
      const userExists = await this.usersService.findByEmail(payload.email);
      if (!userExists) {
        throw new UnauthorizedException('User no longer exists in database');
      }
      request.user = payload; 
      return true;
    } catch {
      throw new UnauthorizedException('token is not apply');
    }
  }



}