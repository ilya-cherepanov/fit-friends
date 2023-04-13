import { Module } from '@nestjs/common';
import { TrainingDiaryController } from './training-diary.controller';
import { TrainingDiaryService } from './training-diary.service';
import {TrainingsModule} from '../trainings/trainings.module';
import {TrainingDiaryRepository} from './training-diary.repository';


@Module({
  imports: [TrainingsModule],
  controllers: [TrainingDiaryController],
  providers: [TrainingDiaryService, TrainingDiaryRepository],
})
export class TrainingDiaryModule {}
