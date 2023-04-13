import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDiaryService } from './training-diary.service';

describe('TrainingDiaryService', () => {
  let service: TrainingDiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingDiaryService],
    }).compile();

    service = module.get<TrainingDiaryService>(TrainingDiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
