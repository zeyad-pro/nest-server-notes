import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/users/schemas/user.shcema'; // تأكد من المسار الصحيح لديك

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    // private readonly emailService: EmailService,
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
  ) {}

  private sendMail(options: { to: string; subject: string; html: string }) {
    this.logger.log(`Email sent out to ${options.to}`);

    return this.mailerService.sendMail({
      from: `"Zeyad Maher" <noreply@ziadmaher.com>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  public async sendResetPasswordLink(email: string): Promise<void> {
    const payload = { email };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });

    const user = await this.userModel.findOneAndUpdate(
      { email },
      { resetToken: token },
      { returnDocument: 'after' },
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
    // console.log("url" , url)
    const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 700;">Zeyad Maher</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Security & Account Recovery</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 25px;" />
      
      <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">Hi,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">We received a request to reset the password for your account. No worries, you can reset it by clicking the button below:</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${url}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 14px 30px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          Reset Password
        </a>
      </div>
      
      <p style="font-size: 14px; line-height: 1.5; color: #9ca3af; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
        <strong>Note:</strong> This link is temporary and will expire soon for safety reasons. If you didn't request a password reset, you can safely ignore this email.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 35px; margin-bottom: 15px;" />
      <p style="text-align: center; font-size: 12px; color: #9ca3af; margin: 0;">
        &copy; ${new Date().getFullYear()} Your Project Name. All rights reserved.
      </p>
    </div>
  `;

    return this.sendMail({
      to: email,
      subject: 'Reset password',
      html: htmlTemplate,
    });
  }
  public async SendDeleteaccount(email: string): Promise<void> {
    const payload = { email };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });

    const url = `${this.configService.get('EMAIL_DELETE_URL')}?token=${token}`;
    // console.log("url" , url)
    const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 700;">Zeyad Maher</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Security & Account Recovery</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 25px;" />
      
      <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">Hi,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">We received a request to Delete your account. No worries, you can delete it by clicking the button below:</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${url}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 14px 30px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          delete account
        </a>
      </div>
      
      <p style="font-size: 14px; line-height: 1.5; color: #9ca3af; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
        <strong>Note:</strong> This link is temporary and will expire soon for safety reasons. If you didn't request a account delete, you can safely ignore this email.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 35px; margin-bottom: 15px;" />
      <p style="text-align: center; font-size: 12px; color: #9ca3af; margin: 0;">
        &copy; ${new Date().getFullYear()} Your Project Name. All rights reserved.
      </p>
    </div>
  `;

    return this.sendMail({
      to: email,
      subject: 'Delete account',
      html: htmlTemplate,
    });
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async sendVerificationLink(email: string, url: string): Promise<void> {
    const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; text-align: center;">Welcome! Verify Your Email</h2>
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Thank you for registering. Please confirm your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;

    return this.sendMail({
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlTemplate,
    });
  }

  public async resendVerification(token: string) {
  
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      const user = await this.userModel.findOne({
        email: payload.email.toLowerCase().trim(),
      });

      if (!user) {
        throw new BadRequestException('User with this email does not exist.');
      }

      if (user.isVerified) {
        console.log( 'This account is already verified. Please log in.')
        throw new BadRequestException(
          'This account is already verified. Please log in.',
        );
      }
try {
      // 3. Generate a brand new Verification Token
      const newVerificationToken = this.jwtService.sign(
        { email: user.email },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: '24h', // Grants them another 24 hours to verify
        },
      );
  
      // 4. Update the verificationToken field in the database with the new one
      user.verificationToken = newVerificationToken;
      await user.save();
      const url = `http://localhost:3000/auth/verify-email?token=${newVerificationToken}`
      // 5. Send the new link to the user's email via your EmailService
      await this.sendVerificationLink(
        user.email,
        url,
      );
    } catch (error){
    console.error('Database save error during verification:', error);
  throw new BadRequestException('Failed to finalize user verification.');
    }

    return {
      success: true,
      message:
        'A new verification link has been sent to your email. It is valid for 24 hours.',
    };
  }
}
