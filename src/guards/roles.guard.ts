import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // If no roles are specified, allow access.
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Extract token from the Authorization header

    
    if (!token) {
      return false; // No token, deny access.
    }

    try {
      const user = this.jwtService.verify(token, {secret: process.env.JWT_SECRET}); // Verify the JWT token
      
      // Check if the user's role (from the token) is included in the required roles
      console.log(requiredRoles);
      console.log('-------------------');
      console.log(user);
      console.log(user.role);
      return requiredRoles.includes(user.role.toString()); // If the user's role is included, allow access.
    } catch (error) {
      console.log(error);
      return false; // Token verification failed, deny access.
    }
  }
}
