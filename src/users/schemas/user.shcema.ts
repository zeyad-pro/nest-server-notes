import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

// جوة الـ Schema Class بتاعك:

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, unique: true })
  number: number;

  @Prop()
  passwordHash: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken: string;



  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  
}

export const UserssSchema = SchemaFactory.createForClass(Users);
