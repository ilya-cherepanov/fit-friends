import { Test, TestingModule } from '@nestjs/testing';
import { EatingsService } from './eatings.service';
import {EatingRepository} from './eating.repository';
import {PrismaModule} from '../prisma/prisma.module';

describe('EatingsService', () => {
  let service: EatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [EatingsService, EatingRepository],
    }).compile();

    service = module.get<EatingsService>(EatingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
