import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authData = await this.authService.login(loginDto);

    response.cookie('refreshToken', authData.refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    return {
      user: authData.user,
      accessToken: authData.accessToken,
    };
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authData = await this.authService.register(registerDto);

    response.cookie('refreshToken', authData?.refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    return {
      user: authData?.user,
      accessToken: authData?.accessToken,
    };
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies['refreshToken'] as string;
    if (!token) throw new UnauthorizedException('Usuário não autorizado');

    const { user, refreshToken, accessToken } =
      await this.authService.refreshTokens(token);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
    return { user, accessToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    return { message: 'Logout realizado com sucesso' };
  }
}
