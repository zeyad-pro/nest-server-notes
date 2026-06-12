import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schemas/notes.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private NoteModel: Model<Note>) {}

  create(createNoteDto: CreateNoteDto, currentUser: any) {
    // console.log('--- TEST CURRENT USER ---');
  // console.log(currentUser);
    const creatednote = new this.NoteModel({
      ...createNoteDto,
      user: currentUser?.userid || currentUser?.id,
    });
    return creatednote.save();
  }

  async findAll(currentUser: any) {
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      return this.NoteModel.find();
    }

    return this.NoteModel.find({ user: currentUser.userid });
  }

  findOne(id: string) {
    return this.NoteModel.findById(id);
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return this.NoteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteNote(noteId: string, currentUser: any) {
    const note = await this.NoteModel.findById(noteId);
    if (!note) throw new NotFoundException('النوتة دي مش موجودة أصلاً');
    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'manager' &&
      note.user.toString() !== currentUser.userid
    ) {
      throw new ForbiddenException('أنت بتحاول تمسح نوتة مش بتاعتك! ⛔');
    }

    return this.NoteModel.findByIdAndDelete(noteId);
  }
}
