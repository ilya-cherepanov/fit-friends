import {ConfigService, registerAs} from '@nestjs/config';
import {JWT_HASH_ALGORITHM} from '../constants';
import {JwtSignOptions} from '@nestjs/jwt';


export const jwtOptions = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
}));

export const getJwtAccessConfig = (configService: ConfigService): JwtSignOptions => ({
  secret: configService.get<string>('jwt.accessSecret'),
  expiresIn: configService.get<string>('jwt.accessExpiresIn'),
  algorithm: JWT_HASH_ALGORITHM,
});

export const getJwtRefreshConfig = (configService: ConfigService): JwtSignOptions => ({
  secret: configService.get<string>('jwt.refreshSecret'),
  expiresIn: configService.get<string>('jwt.refreshExpiresIn'),
  algorithm: JWT_HASH_ALGORITHM,
});
