import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import {BalanceRepository} from './balance.repository';
import {PrismaModule} from '../prisma/prisma.module';

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [BalanceService, BalanceRepository],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
