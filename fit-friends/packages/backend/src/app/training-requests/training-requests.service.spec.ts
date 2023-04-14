import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRequestsService } from './training-requests.service';

describe('TrainingRequestsService', () => {
  let service: TrainingRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingRequestsService],
    }).compile();

    service = module.get<TrainingRequestsService>(TrainingRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
