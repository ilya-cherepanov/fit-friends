import { Module } from '@nestjs/common';
import { SportsmenService } from './sportsmen.service';
import { SportsmenController } from './sportsmen.controller';
import {SportsmanRepository} from './sportsman.repository';
import {MulterModule} from '@nestjs/platform-express';
import {getUploadFilesConfig} from '../../config/upload.config';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UsersModule} from '../users/users.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: getUploadFilesConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [SportsmenService, SportsmanRepository],
  controllers: [SportsmenController],
  exports: [SportsmanRepository],
})
export class SportsmenModule {}
