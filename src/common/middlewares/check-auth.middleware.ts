import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class CheckAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'Token de acesso não fornecido, acesso negado',
      );
    }

    return next();
  }
}
