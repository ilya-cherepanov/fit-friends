import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {OrderRepository} from './order.repository';
import {TrainingsModule} from '../trainings/trainings.module';
import {BalanceModule} from '../balance/balance.module';
import {GymsModule} from '../gyms/gyms.module';


@Module({
  imports: [TrainingsModule, BalanceModule, GymsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
