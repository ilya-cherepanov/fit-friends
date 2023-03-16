import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {JWT_HASH_ALGORITHM} from '../../../constants';
import {JWTPayload} from '@fit-friends/shared-types';


@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
      algorithms: JWT_HASH_ALGORITHM,
    });
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return {
      ...payload,
    };
  }
}
