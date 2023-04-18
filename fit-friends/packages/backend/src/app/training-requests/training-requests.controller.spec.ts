import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRequestsController } from './training-requests.controller';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingRequestsService} from './training-requests.service';
import {TrainingRequestRepository} from './training-request.repository';

describe('TrainingRequestsController', () => {
  let controller: TrainingRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [TrainingRequestsService, TrainingRequestRepository],
      controllers: [TrainingRequestsController],
    }).compile();

    controller = module.get<TrainingRequestsController>(
      TrainingRequestsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
