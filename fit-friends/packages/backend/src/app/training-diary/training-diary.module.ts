import { Module } from '@nestjs/common';
import { TrainingDiaryController } from './training-diary.controller';
import { TrainingDiaryService } from './training-diary.service';
import {TrainingsModule} from '../trainings/trainings.module';
import {TrainingDiaryRepository} from './training-diary.repository';
import {BalanceModule} from '../balance/balance.module';


@Module({
  imports: [TrainingsModule, BalanceModule],
  controllers: [TrainingDiaryController],
  providers: [TrainingDiaryService, TrainingDiaryRepository],
})
export class TrainingDiaryModule {}
