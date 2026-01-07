import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const acceptedRoles = this.reflector.get(Roles, context.getHandler());
    if (!acceptedRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (token === process.env.MASTER_ACCESS_TOKEN) {
      return true;
    }

    const user = this.jwtService.verify<{ id: string; role: number }>(token!);
    const isAccessGranted = acceptedRoles.includes(user.role);

    if (isAccessGranted) {
      return true;
    }

    throw new ForbiddenException(
      'Usuário não autorizado para acessar este recurso',
      {
        cause: `Usuário de id ${user.id} e cargo ${user.role} tentou acessar recurso ${request.url}`,
      },
    );
  }
}
