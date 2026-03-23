import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

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
            secret: 'access_secret',
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: 'refresh_secret',
            expiresIn: '7d',
        });

        await this.userService.updateRefreshToken(userId, refreshToken);

        return { accessToken, refreshToken };
    }
}