import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscriberRepository } from './subscriber.repository';
import { SubscribersController } from './subscribers.controller';
import {MailingModule} from '../mailing/mailing.module';
import {TrainingsModule} from '../trainings/trainings.module';

@Module({
  imports: [TrainingsModule, MailingModule],
  providers: [SubscribersService, SubscriberRepository],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
