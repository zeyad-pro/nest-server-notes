import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole, Users, UsersDocument } from 'src/users/schemas/user.shcema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { registerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
  ) {}
  private generateToken(user: any) {
    const payload = {
      userid: user._id, // 👈 غيرناها لـ userid عشان تطابق السيرفيس
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: registerDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    const existingNumber = await this.usersService.findByFields({
      number: registerDto.number,
    });
    if (existingNumber) {
      throw new ConflictException('this phone number waas already exist!');
    }

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    
  const passwordHash = await bcrypt.hash(registerDto.password, 10);
     
  const verificationToken = this.jwtService.sign(
        { email: registerDto.email },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: '24h', // صلاحية الرابط يوم كامل
        },
      );

    const user = await this.userModel.create({
      ...registerDto,
      verificationToken,
      isVerified: false,
      role: UserRole.USER,
      passwordHash,
    });

    const verificationUrl = `${this.configService.get('EMAIL_VERIFICATION_URL')}?token=${verificationToken}`;

    await this.emailService.sendVerificationLink(user.email, verificationUrl);
    // const user = await this.usersService.create(dto);
    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }
    // console.log('--- USER DATA FROM DB ---');
    // console.log('User Object:', user);
    // console.log('PasswordHash Field:', user.passwordHash);
    // console.log('Password Field:', password);
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    return {
      message: 'Login successful',
      accessToken: this.generateToken(user),
    };
  }

  ///////////////////////////////////

  async resetPassword(token: string, password: string): Promise<void> {
    const email = await this.emailService.decodeConfirmationToken(token);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        $unset: { resetToken: 1 }, // لحذف حقل resetToken من المستند تماماً
      },
      { returnDocument: 'after' },
    );
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.emailService.sendResetPasswordLink(email);
  }

  ////////////////////////
  async deleting_account(token: string): Promise<void> {
    const email = await this.emailService.decodeConfirmationToken(token);
    const user = await this.userModel.findOneAndDelete({ email });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
  }

  async deleteacoount(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.emailService.SendDeleteaccount(email);
  }

  //////////
  public async verifyEmail(token: string) {
    try {
      // 1. فك التوكن والتأكد من صلاحيته
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      // 2. البحث عن المستخدم الذي يملك هذا التوكن والإيميل
      const user = await this.userModel.findOne({
        email: payload.email,
        verificationToken: token,
      });
      if (!user) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      // 3. تحديث حالة الحساب ومسح التوكن المؤقت
      user.isVerified = true;
      user.verificationToken = '';
      await user.save();

      return { message: 'Email verified successfully! You can now log in.' };
    } catch (error) {
      // console.log(error);

      throw new BadRequestException(
        'Email verification failed or token expired.',
      );
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }
    return null;
  }
}
