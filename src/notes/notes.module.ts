import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, notesSchema } from './schemas/notes.schema';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: notesSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWt_TOOKEN,
      signOptions: { expiresIn: '60s' },
    }),],
  controllers: [NotesController],
  providers: [NotesService],
  
})
export class NotesModule {}
