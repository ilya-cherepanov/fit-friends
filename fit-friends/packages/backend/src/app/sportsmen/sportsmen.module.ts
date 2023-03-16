import { Module } from '@nestjs/common';
import { SportsmenService } from './sportsmen.service';
import { SportsmenController } from './sportsmen.controller';
import {SportsmanRepository} from './sportsman.repository';
import {MulterModule} from '@nestjs/platform-express';
import {getUploadFilesConfig} from '../../config/upload.config';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: getUploadFilesConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    })],
  providers: [SportsmenService, SportsmanRepository],
  controllers: [SportsmenController],
})
export class SportsmenModule {}
