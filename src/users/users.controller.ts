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
  NotFoundException,
  BadRequestException,
  ConflictException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard/user.guard';
import { Roles } from './decorator/roles.decorator';
import { UserRole } from './schemas/user.shcema';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(
    @Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto,
  ) {
    const existing = await this.usersService.findByEmail(createUserDto.email);
    const existingNumber = await this.usersService.findByFields({
      number: createUserDto.number,
    });
    if (existingNumber) {
      throw new ConflictException('this phone number waas already exist!');
    }

    if (existing && existingNumber) {
      throw new BadRequestException('User already exists');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ID format. Must be a 24-character hex string.`,
      );
    }
   // const item = await this.usersService.findOne(id);

   // if (!item) {
  //    throw new NotFoundException(`Item with ID ${id} was not found`);
  //  }

   return this.usersService.findOne(id, req.user);
  }

  @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    // 1. Validate that the string is a true MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ID format. Must be a 24-character hex string.`,
      );
    }

   // const item = await this.usersService.findOne(id);

  //  if (!item) {
  //    throw new NotFoundException(`Item with ID ${id} was not found`);
  //  }

    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ID format. Must be a 24-character hex string.`,
      );
    }
   // const item = await this.usersService.findOne(id);
//
  // if (!item) {
   //   throw new NotFoundException(`Item with ID ${id} was not found`);
   // }

    return this.usersService.remove(id, req.user);
  }
}
