import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_AUTH_SECRET_KEY!,
      callbackURL: `${process.env.HOST_URL!}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  authenticate(req: any, options: any) {
    const redirect = req.query?.redirect;
    super.authenticate(req, {
      ...options,
      state: redirect || undefined,
    });
  }

  validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    return {
      email: profile.emails![0].value,
      name: profile.displayName,
    };
  }
}
