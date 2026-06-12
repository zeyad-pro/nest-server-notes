import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/user.shcema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private UsersModel: Model<Users>) {}

  // ✅ Define create user function to store register data in to the database
  async create(dto: CreateUserDto): Promise<Users> {
    
    const passwordHash = await bcrypt.hash(dto.password, 10);
    // console.log("ggggggggggggg")
    const createdUser = new this.UsersModel({
      ...dto,
      passwordHash,
    });
    // console.log("ggggggggggggg")

    return createdUser.save();
  }

  findAll() {
    return this.UsersModel.find();
  }

  async findOne(targetId: string, currentUser: any) {




    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'manager' &&
      targetId !== currentUser.userid 
    ) {
      throw new ForbiddenException('theres no acction');
    }

    const user = await this.UsersModel.findById(targetId);
    if (!user) {
      throw new NotFoundException(`User with ID "${targetId}" not found`);
    }
    return user;
   
  }

async update(id: string, updateUsersDto: UpdateUserDto, currentUser: any) {
  //  const updatedUser = await this.UsersModel.findByIdAndUpdate(
   //   id,
    //  updateUsersDto,
     //  { new: true, runValidators: true },
      // ).exec();

      
   await this.findOne(id, currentUser);
    return this.UsersModel.findByIdAndUpdate(
      id,
      updateUsersDto,
      { new: true, runValidators: true },
    ).exec();
  }

async remove(id: string, currentUser: any) {
      await this.findOne(id, currentUser);

    return this.UsersModel.findByIdAndDelete(id);
  }







  async findByEmail(email: string): Promise<Users | null> {
    return this.UsersModel.findOne({email} );
  }

    async findByFields(fields: { number?: number; email?: string }) {
      return await this.UsersModel.findOne(fields).exec();
    }

}
