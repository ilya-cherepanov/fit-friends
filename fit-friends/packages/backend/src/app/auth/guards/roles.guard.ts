import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../../../constants';
import {UserRole} from '@fit-friends/core';
import {Request} from 'express';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    return roles.includes(request.user['role']);
  }
}
