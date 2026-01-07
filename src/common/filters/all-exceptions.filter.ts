import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req: Request = context.getRequest();
    const res: Response = context.getResponse();

    const infos = {
      name: exception.name,
      method: req.method,
      path: req.url,
      statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      message: exception.message.startsWith('\n') // protege contra vazamento de stack
        ? 'Internal Server Error'
        : exception.message,
      cause: exception.message.startsWith('\n') // logging de erros com stack internamente
        ? exception.message
        : exception.cause,
    };

    console.error(`\n[ERROR at ${infos.timestamp} in ${infos.path}]\n`, infos);
    res.status(infos.statusCode).json({
      statusCode: exception.getStatus(),
      message: infos.message,
      timestamp: infos.timestamp,
      path: infos.path,
    });
  }
}
