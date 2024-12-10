import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Role } from './role.enum'; // Import your Role enum
// import { ROLES_KEY } from './roles.decorator'; // Import the Roles decorator key
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enums';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles specified means the route is public or not restricted
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1]; // Get token from Bearer authorization
    const user = this.jwtService.decode(token); // Decode the JWT to get user information

    if (!user || !user['roles']) {
      return false; // If no user or no roles found, deny access
    }

    return requiredRoles.some((role) => user['roles'].includes(role));
  }
}
