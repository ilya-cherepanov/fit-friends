import { Test, TestingModule } from '@nestjs/testing';
import { EatingsService } from './eatings.service';

describe('EatingsService', () => {
  let service: EatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatingsService],
    }).compile();

    service = module.get<EatingsService>(EatingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
