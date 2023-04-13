import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDiaryController } from './training-diary.controller';

describe('TrainingDiaryController', () => {
  let controller: TrainingDiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingDiaryController],
    }).compile();

    controller = module.get<TrainingDiaryController>(TrainingDiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
