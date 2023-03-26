import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {OrderRepository} from './order.repository';
import {TrainingsModule} from '../trainings/trainings.module';

@Module({
  imports: [TrainingsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
