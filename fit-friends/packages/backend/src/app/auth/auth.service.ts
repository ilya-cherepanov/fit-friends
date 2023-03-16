import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {JWTPayload, TokensResponse} from '@fit-friends/shared-types';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {getJwtAccessConfig, getJwtRefreshConfig} from '../../config/jwt.config';
import {UserRepository} from '../users/user.repository';
import {LoginUserDTO} from './dto/login-user.dto';
import {INVALID_CREDENTIALS, USER_NOT_FOUND} from '../../constants';
import {BaseUserEntity} from '../users/user.entity';
import {UserRole} from '@fit-friends/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(dto: LoginUserDTO) {
    const user = await this.userRepository.getByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const userEntity = BaseUserEntity.createFromPrisma(user);
    if (!userEntity) {
      throw new InternalServerErrorException();
    }

    if (!(await userEntity.checkPassword(dto.password))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const tokens = await this.generateTokens({
      sub: userEntity.id,
      role: userEntity.role,
    });

    await this.userRepository.saveRefreshToken(userEntity.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    await this.userRepository.saveRefreshToken(user.id, null);
  }

  async refresh(jwtPayload: JWTPayload) {
    const user = await this.userRepository.getById(jwtPayload.sub);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (user.refreshToken !== jwtPayload.refreshToken) {
      throw new ForbiddenException();
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      role: user.role as UserRole,
    })

    await this.userRepository.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(payload: JWTPayload): Promise<TokensResponse> {
    return {
      accessToken: await this.jwtService.signAsync(payload, getJwtAccessConfig(this.configService)),
      refreshToken: await this.jwtService.signAsync(payload, getJwtRefreshConfig(this.configService)),
    };
  }
}
