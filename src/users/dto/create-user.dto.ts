// src/users/dto/create-user.dto.ts
export class CreateUserDto {
    email: string;
    role: string;  // e.g., 'admin', 'user', 'viewer'
  }