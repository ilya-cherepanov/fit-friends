import { Test, TestingModule } from '@nestjs/testing';
import { EatingsController } from './eatings.controller';

describe('EatingsController', () => {
  let controller: EatingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EatingsController],
    }).compile();

    controller = module.get<EatingsController>(EatingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
