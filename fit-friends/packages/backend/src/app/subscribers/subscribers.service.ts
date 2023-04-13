import { Injectable } from '@nestjs/common';
import {SubscriberRepository} from './subscriber.repository';
import {MailingService} from '../mailing/mailing.service';
import {TrainingRepository} from '../trainings/training.repository';


@Injectable()
export class SubscribersService {
  constructor(
    private readonly subscriberRepository: SubscriberRepository,
    private readonly trainingRepository: TrainingRepository,
    private readonly mailingService: MailingService,
  ) {}

  async sendNotifications() {
    const subscribers = await this.subscriberRepository.getAll();
    await this.mailingService.sendTrainingNotifications(subscribers);

    await this.trainingRepository.resetNew();
    await this.subscriberRepository.clear();
  }

  async get(sportsmanId: number, coachId: number) {
    const subscriber = await this.subscriberRepository.get(sportsmanId, coachId);
    if (!subscriber) {
      return {isSubscribed: false};
    }

    return {isSubscribed: !subscriber.needToClean};
  }

  async setState(sportsmanId: number, coachId: number, state: boolean) {
    const subscriber = await this.subscriberRepository.setSubscription(sportsmanId, coachId, state);

    return {isSubscribed: !subscriber.needToClean};
  }
}
