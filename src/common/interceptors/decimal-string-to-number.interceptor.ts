import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class DecimalStringToNumberInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(convertNumericStrings));
  }
}

function convertNumericStrings<T>(value: T): T {
  if (typeof value === 'string' && isNumeric(value)) {
    return Number(value) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map(convertNumericStrings) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const clone: any = {};
    for (const key in value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      clone[key] = convertNumericStrings((value as any)[key]);
    }
    return clone as T;
  }

  return value;
}

function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && str.trim() !== '';
}
