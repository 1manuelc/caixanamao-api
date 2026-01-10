import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res: Response = context.getResponse();
    const req: Request = context.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const infos = {
      statusCode: status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      message: typeof message === 'object' ? (message as any).message : message,
      path: req.url,
      timestamp: new Date().toISOString(),
    };

    console.error(
      `[ERROR at ${infos.timestamp} in "${infos.path}"]\n`,
      exception,
    );
    res.status(status).json(infos);
  }
}
