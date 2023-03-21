import {Module} from '@nestjs/common';
import {TrainingsService} from './trainings.service';
import {TrainingsController} from './trainings.controller';
import {TrainingRepository} from './training.repository';
import {UsersModule} from '../users/users.module';
import {MulterModule} from '@nestjs/platform-express';
import {getUploadFilesConfig} from '../../config/upload.config';
import {ConfigModule, ConfigService} from '@nestjs/config';


@Module({
  imports: [
    UsersModule,
    MulterModule.registerAsync({
      useFactory: getUploadFilesConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [TrainingsService, TrainingRepository],
  controllers: [TrainingsController],
})
export class TrainingsModule {}
