import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDiaryService } from './training-diary.service';
import {TrainingDiaryRepository} from './training-diary.repository';
import {TrainingsModule} from '../trainings/trainings.module';
import {PrismaModule} from '../prisma/prisma.module';


describe('TrainingDiaryService', () => {
  let service: TrainingDiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TrainingsModule, PrismaModule],
      providers: [TrainingDiaryService, TrainingDiaryRepository],
    }).compile();

    service = module.get<TrainingDiaryService>(TrainingDiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
