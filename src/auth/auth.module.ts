// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';
import { DatabaseService } from 'src/database/database.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [ AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Apply RolesGuard globally to all routes
    },UsersService,MailerService,DatabaseService],
})
export class AuthModule {}
