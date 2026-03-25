import { Body, Controller, Post, Req, Get, Res, UseGuards, Query } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: { user: { userId: string } }) {
    return this.authService.logout(req.user.userId);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: { user: { email: string; name: string }; query: { state?: string } },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.googleLogin(req.user);
    const params = new URLSearchParams({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      email: req.user.email,
    });

    const redirect = req.query.state;
    const allowedOrigins = [
      'planix://',
      process.env.WEB_URL,
    ].filter(Boolean) as string[];

    const target = allowedOrigins.find((o) => redirect?.startsWith(o));

    if (target && redirect) {
      const separator = redirect.includes('?') ? '&' : '?';
      res.redirect(`${redirect}${separator}${params.toString()}`);
    } else {
      const fallback = process.env.WEB_URL || process.env.HOST_URL!;
      res.redirect(`${fallback}/auth/callback?${params.toString()}`);
    }
  }
}
