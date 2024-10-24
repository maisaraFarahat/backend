// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Prisma } from '@prisma/client';  // Import Prisma types
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private mailerService: MailerService,
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
    ) { }

    /**
    * Creates a new user with a generated password, assigns a role, saves the user to the database,
    * and sends a welcome email with the temporary password.
    *
    * @param {CreateUserDto} createUserDto - The data transfer object containing the user's email and role.
    * @returns {Promise<{ msg: string }>} - Returns a message indicating successful creation and email delivery.
    * @throws {Error} - Throws an error if the role is not found in the database.
    */
    async create(createUserDto: CreateUserDto) {
        const generatedPassword = this.generatePassword();

        // Step 2: Hash the password and store it in the database
        const hashedPassword = await bcrypt.hash(generatedPassword, +process.env.ENCRYPTION_ROUNDS);

        // Save user with hashed password to database...
        const roleRecord = await this.databaseService.role.findUnique({
            where: { roleName: createUserDto.role },
        });



        // @TODO: Handle errors
        if (!roleRecord) {
            throw new Error('Role not found');
        }

        // Step 3: Create the user and assign the role
        const newUser = await this.usersService.create(createUserDto.email, hashedPassword, roleRecord)



        await this.mailerService.sendMail(
            createUserDto.email,
            'Welcome to Blue Ribbon App!',
            `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Blue Ribbon</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f8ff; /* Light blue background */
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 30px;
                text-align: center;
            }
            h1 {
                color: #1e90ff; /* Dodger blue */
                font-size: 36px;
            }
            p {
                font-size: 18px;
                color: #555;
            }
            .password {
                font-size: 24px;
                color: #ff4500; /* Orange red */
                font-weight: bold;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
            .button {
                background-color: #1e90ff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                display: inline-block;
                margin-top: 20px;
            }
            .button:hover {
                background-color: #4169e1; /* Royal blue */
            }
        </style>
    </head>
    <body>
    
        <div class="container">
            <h1>Welcome to Blue Ribbon!</h1>
            <p>We are excited to have you on board. Your account has been created, and your temporary password is:</p>
            <p class="password">${generatedPassword}</p>
            <p>You will be prompted to change your password once you log in for the first time.</p>
            <a href="#" class="button">Go to Blue Ribbon</a>
            <div class="footer">
                <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
        </div>
    
    </body>
    </html>
    `
        );


        return { "msg": `User created successfully! Please check your email. ${createUserDto.email}` };
    }

    // Sign-In logic

    /**
    * Signs in a user by verifying their email and password, and returns a JWT token if successful.
    * Also checks if this is the user's first sign-in (i.e., password has not been changed).
    *
    * @param {string} email - The email of the user trying to sign in.
    * @param {string} password - The password provided by the user for authentication.
    * @returns {Promise<{ access_token: string, first_time: boolean }>} - Returns a JWT token and a flag indicating whether this is the user's first time signing in.
    * @throws {UnauthorizedException} - Throws an error if the email is not found or the password is invalid.
    */
    async signIn(email: string, password: string) {
        // Step 1: Find the user by email
        const user = await this.usersService.findByEmail(email);
        // Step 2: Validate password
        const flag = (user.createdAt.getTime() === user.updatedAt.getTime())
        // check if first sign in ( password not updated)
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Step 2: Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Step 3: Generate JWT token
        const payload = { id: user.id, email: user.email, role: user.role.roleName };  // You can add roles to the payload if needed
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            first_time: flag, // You can add a flag to indicate if the user is a first time user
        };
    }
















    //    Helpers:
    private generatePassword(): string {
        return Math.random().toString(36).slice(-8); // Simple password generator
    }



}
