import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import {PrismaModule} from '../prisma/prisma.module';
import {BalanceService} from './balance.service';
import {BalanceRepository} from './balance.repository';

describe('BalanceController', () => {
  let controller: BalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [BalanceService, BalanceRepository],
      controllers: [BalanceController],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
