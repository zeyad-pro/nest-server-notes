import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  UseGuards,
  SetMetadata,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Types } from 'mongoose';
import { NotesGuard } from './guard/notes.guard';

@Controller('notes')
@UseGuards(NotesGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(NotesGuard)


  createNote(@Req() request: any, @Body() createNoteDto: any) {
   const bodyUserId = request.body.userid;
  const tokenUserId = request.user.userid;
    if (bodyUserId && bodyUserId !== tokenUserId) {
      return {
        message: 'false!',
        userIdFromToken:bodyUserId,
      };
    }
    return this.notesService.create(createNoteDto, request.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.notesService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ID format. Must be a 24-character hex string.`,
      );
    }
    const item = await this.notesService.findOne(id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} was not found`);
    }

    return this.notesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ID format. Must be a 24-character hex string.`,
      );
    }
    const item = await this.notesService.findOne(id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} was not found`);
    }
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ID format. Must be a 24-character hex string.`,
      );
    }
    const item = await this.notesService.findOne(id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} was not found`);
    }
    return this.notesService.deleteNote(id, req.user);
  }
}
