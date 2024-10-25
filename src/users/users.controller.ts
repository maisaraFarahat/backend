import { BadRequestException, Body, Controller, Delete, Get, Headers, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {

    constructor(private readonly userService: UsersService,   private jwtService: JwtService) { }

    @Get()
    @Roles('Viewer', 'Admin')
    findAll() {
      return this.userService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.userService.findOne(+id);
    }


    @Roles('Admin','Viewer','User')
    @Patch('changePassword')
    changePassword(@Headers('authorization') token:string  ,@Body() updateUserDto: UpdateUserDto) {
       const actualToken = token.split(' ')[1];
      const user = this.jwtService.verify(actualToken, {secret: process.env.JWT_SECRET});
      if (updateUserDto.roleName){
        throw new BadRequestException('Role is not allowed to be updated');
      }
      return this.userService.update(user.id, updateUserDto);
    }

    @Roles('Admin','User')
    @Patch('editProfile')
    update(@Headers('authorization') token:string  ,@Body() updateUserDto: UpdateUserDto) {
      const actualToken = token.split(' ')[1];
      const user = this.jwtService.verify(actualToken, {secret: process.env.JWT_SECRET});
      if (updateUserDto.roleName){
        throw new BadRequestException('Role is not allowed to be updated');
      }
      return this.userService.update(user.id, updateUserDto);
    }
    
    @Roles('Admin')
    @Patch('editRole/:id')
    updateRole(@Param('id') id:string  ,@Body() updateUserDto: UpdateUserDto) {
      console.log(updateUserDto);
      return this.userService.update(+id, updateUserDto);
    }

    @Roles('Admin','User')
    @Delete('/delete')
    delete(@Headers('authorization') token:string  ,@Body() updateUserDto: Prisma.UserUpdateInput) {
      const actualToken = token.split(' ')[1];
      const user = this.jwtService.verify(actualToken, {secret: process.env.JWT_SECRET});
      return this.userService.remove(user.id);
    }


    @Roles('Admin')
    @Delete('deleteUser/:id')
    deleteUserForAdmin(@Param('id') id:string  ,@Body() updateUserDto: Prisma.UserUpdateInput) {
      return this.userService.remove(+id);
    }

}
