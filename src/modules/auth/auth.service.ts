import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.userService.create(email, hash);

    return this.generateTokens(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    return this.generateTokens(user.id, user.email);
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET!,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET!,
      expiresIn: '7d',
    });

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(userId, hash);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ email: string }>(refreshToken, {
        secret: 'refresh_secret',
      });

      const user = await this.userService.findByEmail(payload.email);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }

  async googleLogin(user: { email: string; name: string }) {
    let existingUser = await this.userService.findByEmail(user.email);

    if (!existingUser) {
      existingUser = await this.userService.create(user.email, '');
    }

    return this.generateTokens(existingUser.id, existingUser.email);
  }
}
