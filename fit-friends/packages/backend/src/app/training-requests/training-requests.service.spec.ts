import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRequestsService } from './training-requests.service';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingRequestRepository} from './training-request.repository';

describe('TrainingRequestsService', () => {
  let service: TrainingRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [TrainingRequestsService, TrainingRequestRepository],
    }).compile();

    service = module.get<TrainingRequestsService>(TrainingRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
