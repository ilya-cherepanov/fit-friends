import {PrismaService} from '../prisma/prisma.service';
import {Injectable, NotFoundException} from '@nestjs/common';
import {Notification} from '../../types/notification';


@Injectable()
export class NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(notification: Notification) {
    return this.prismaService.notification.create({
      data: notification,
    });
  }

  async getMany(userId: number, take: number, skip: number) {
    const [notifications, count] = await this.prismaService.$transaction([
      this.prismaService.notification.findMany({
        where: {userId},
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      this.prismaService.notification.count({
        where: {userId},
      }),
    ]);

    return {
      notifications,
      count,
    };
  }

  async delete(notificationId: number, userId: number) {
    const {count} = await this.prismaService.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (count === 0) {
      throw new NotFoundException();
    }
  }
}
