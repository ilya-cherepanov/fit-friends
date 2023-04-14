import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRequestsController } from './training-requests.controller';

describe('TrainingRequestsController', () => {
  let controller: TrainingRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
