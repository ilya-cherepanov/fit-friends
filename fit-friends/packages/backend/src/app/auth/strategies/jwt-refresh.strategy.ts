import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {JWT_HASH_ALGORITHM} from '../../../constants';
import {JWTPayload} from '@fit-friends/shared-types';
import {Request} from 'express';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      algorithms: JWT_HASH_ALGORITHM,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTPayload): Promise<JWTPayload> {
    const refreshToken = req.get('authorization').trim().split(' ').at(-1);

    return {
      ...payload,
      refreshToken,
    };
  }
}
