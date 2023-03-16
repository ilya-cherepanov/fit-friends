import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {JwtAccessStrategy} from './strategies/jwt-access.strategy';
import {JwtRefreshStrategy} from './strategies/jwt-refresh.strategy';
import {UsersModule} from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy],
})
export class AuthModule {}
