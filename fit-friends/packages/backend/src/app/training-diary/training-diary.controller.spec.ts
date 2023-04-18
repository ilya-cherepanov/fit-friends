import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDiaryController } from './training-diary.controller';
import {TrainingsModule} from '../trainings/trainings.module';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingDiaryService} from './training-diary.service';
import {TrainingDiaryRepository} from './training-diary.repository';


describe('TrainingDiaryController', () => {
  let controller: TrainingDiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TrainingsModule, PrismaModule],
      providers: [TrainingDiaryService, TrainingDiaryRepository],
      controllers: [TrainingDiaryController],
    }).compile();

    controller = module.get<TrainingDiaryController>(TrainingDiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
