import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Subscriber} from '../../types/subscriber';


@Injectable()
export class SubscriberRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<Subscriber[]> {
    const subscribers = await this.prismaService.subscriber.findMany({
      include: {
        subscriber: {
          include: {
            subscriptions: {
              include: {
                trainer: {
                  include: {
                    coach: {
                      include: {
                        trainings: {
                          where: {isNew: true}
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
    });

    return subscribers.map((subscriber) => ({
      id: subscriber.subscriber.id,
      name: subscriber.subscriber.name,
      email: subscriber.subscriber.email,
      coaches: subscriber.subscriber.subscriptions.map((subscription) => ({
        id: subscription.trainer.id,
        name: subscription.trainer.name,
        trainings: subscription.trainer.coach.trainings.map((training) => ({
          id: training.id,
          title: training.title,
          description: training.description,
        })),
      })),
    }));
  }

  async get(sportsmanId: number, coachId: number) {
    return this.prismaService.subscriber.findFirst({
      where: {
        subscriberId: sportsmanId,
        trainerId: coachId,
      },
    });
  }

  async clear() {
    this.prismaService.subscriber.deleteMany({
      where: {
        needToClean: true,
      },
    });
  }

  async setSubscription(sportsmanId: number, coachId: number, state: boolean) {
    return this.prismaService.subscriber.upsert({
      where: {
        subscriberId_trainerId: {
          subscriberId: sportsmanId,
          trainerId: coachId,
        },
      },
      create: {
        subscriberId: sportsmanId,
        trainerId: coachId,
        needToClean: !state,
      },
      update: {
        needToClean: !state,
      },
    });
  }
}
