import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports : [DatabaseModule, MailerModule],
  providers: [UsersService,JwtService],
  controllers: [UsersController]
})
export class UsersModule {}
