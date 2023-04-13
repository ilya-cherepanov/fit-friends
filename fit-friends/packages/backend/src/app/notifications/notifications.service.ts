import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {NotificationRepository} from './notification.repository';
import {MAX_COLLECTION_LENGTH, NotificationText} from '@fit-friends/core';


@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async create(userId: number, text: string) {
    if (text.length < NotificationText.MinLength) {
      throw new InternalServerErrorException(
        `The notification must be greater than or equal to ${NotificationText.MinLength} characters`
      );
    }

    if (text.length > NotificationText.MaxLength) {
      throw new InternalServerErrorException(
        `The notification must be less than or equal to ${NotificationText.MaxLength} characters`
      );
    }

    return this.notificationRepository.create({userId, text});
  }

  async getMany(userId: number, page: number) {
    const skip = MAX_COLLECTION_LENGTH * page;

    const {notifications, count} = await this.notificationRepository.getMany(userId, MAX_COLLECTION_LENGTH, skip);

    return {
      currentPage: page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: notifications,
    }
  }

  async delete(notificationId: number, userId: number) {
    return this.notificationRepository.delete(notificationId, userId);
  }
}
