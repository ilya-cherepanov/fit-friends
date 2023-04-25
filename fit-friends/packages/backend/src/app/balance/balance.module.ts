import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import {BalanceRepository} from './balance.repository';


@Module({
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
  exports: [BalanceService],
})
export class BalanceModule {}
