import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constants/constants';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflactor: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflactor.getAllAndOverride<RoleEnum[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;

    // if (!user || !user.roles) {
    //   throw new ForbiddenException('Access denied');
    // }

    // return requiredRoles.some((role) =>
    //   user.roles.some((userRole) => userRole.name === role),
    // );
  }
}
