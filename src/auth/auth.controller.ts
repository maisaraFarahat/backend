import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Controller('auth')
export class AuthController {


  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  
  @Post('signin') 
  async signIn(@Body() credentials:{email: string, password: string}) {
    return this.authService.signIn(credentials.email, credentials.password);
  }


}
