import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from 'src/common/password/password.service';
import { JwtService } from 'src/common/jwt/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, JwtService],
})
export class AuthModule {}
