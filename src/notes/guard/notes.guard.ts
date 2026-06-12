import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 

@Injectable()
export class NotesGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. تشيك وجود التوكن في الهيدرز
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('أنت مش باعت توكن يا فنان!');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 2. فك التوكن (تأكد إن الاسبلنج بتاع الـ secret نفس اللي في الـ .env بالظبط)
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_KEY });
      
      // 3. بنرمي بيانات اليوزر جوه الـ request عشان الـ Controller والـ Service يشوفوها
      request.user = payload; 
      return true;
    } catch {
      throw new UnauthorizedException('التوكن ده مزور أو منتهي الصلاحية!');
    }
  }
}