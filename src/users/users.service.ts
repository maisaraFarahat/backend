// src/users/users.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';

import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { Prisma, Role, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ViewUserDto } from './dto/view-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {


  constructor(
    private mailerService: MailerService,
    private readonly databaseService: DatabaseService) { }


  async create(email: string, hashedPassword: string, role: Role): Promise<User> {



    const restDto = {
      email, password: hashedPassword, role: { connect: { id: role.id } }
    };


    // Step 3: Create the user and assign the role
    const newUser = await this.databaseService.user.create({
      data: restDto,
      include: {
        role: true,  // Optional: include roles in the response
      },
    });
    return newUser;
  }





  async findByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
      include: { role: true },
    });
    return user
  }




  async findAll() {
    return (await this.databaseService.user.findMany({ include: { role: true }, })).map(user => {
      return this.toViewUserDto(user);
    });
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      }
    });
  }




  async update(id: number, updateUserDto: UpdateUserDto) {
    let { roleName, ...resultDto } = updateUserDto;
    let finalDto = {}
    if (updateUserDto.password) {
      resultDto.password = await bcrypt.hash(updateUserDto.password, +process.env.ENCRYPTION_ROUNDS);
    }else{
      const user = this.databaseService.user.findUnique({
        where: { id }
      })
      resultDto.password = (await user).password
    }
    
    if (updateUserDto.roleName) {
      const role = this.databaseService.role.findUnique({
        where: { roleName: updateUserDto.roleName }
      })
      finalDto = { ...resultDto, role: { connect: { id: (await role).id } } }
    } else {
      finalDto = { ...resultDto }
    }
    return this.databaseService.user.update({
      where:
        { id, },
      data: finalDto,
    });
  }







  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      }
    });
  }




  // Helpers
  private toViewUserDto(user: any): ViewUserDto {
    return {
      email: user.email,
      role: user.role.roleName, // Assuming role has a `roleName` field
      id: user.id,
    };
  }
}
