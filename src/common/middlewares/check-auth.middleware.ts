import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class CheckAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Acesso negado!');
    }

    try {
      jwt.verify(token, process.env.SECRET_KEY!);
      next();
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException('O Token é inválido!');
      }
    }
  }
}
