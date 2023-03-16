import {Module} from '@nestjs/common';
import {CoachesService} from './coaches.service';
import {CoachRepository} from './coach.repository';
import {CoachesController} from './coaches.controller';
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
  providers: [CoachesService, CoachRepository],
  controllers: [CoachesController],
})
export class CoachesModule {
}
