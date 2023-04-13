import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {FriendRepository} from './friend.repository';
import {SportsmanRepository} from '../sportsmen/sportsman.repository';
import {FriendsQuery} from '../users/query/friends.query';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';
import {NotificationsService} from '../notifications/notifications.service';
import {
  FRIEND_NOT_FOUND,
  SAME_USER_CANNOT_BE_FRIEND,
  SPORTSMAN_NOT_FOUND,
  USERS_ALREADY_FRIENDS
} from '../../constants';
import {BaseUserEntity} from '../users/user.entity';


@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly sportsmanRepository: SportsmanRepository,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    const sportsman = await this.sportsmanRepository.getById(friendId);
    if (!sportsman) {
      throw new NotFoundException(SPORTSMAN_NOT_FOUND);
    }

    const friend = await this.friendRepository.getById(userId, friendId);
    if (friend) {
      throw new ConflictException(USERS_ALREADY_FRIENDS);
    }

    const createdFriend = this.friendRepository.create(userId, friendId);

    await this.notificationService.create(friendId,
      `Пользователь ${sportsman.name} отправил вам предложение дружбы`
    );

    return createdFriend;
  }

  async accept(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    const friend = await this.friendRepository.accept(friendId, userId);

    await this.notificationService.create(userId,
      `Пользователь ${friend.user.name} принял предложение дружбы`
    );

    return friend;
  }

  async reject(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    await this.friendRepository.reject(friendId, userId);

    const user = await this.sportsmanRepository.getById(userId);
    await this.notificationService.create(friendId, `Пользователь ${user.name} отклонил ваше предложение дружбы`);
  }

  async getMany(userId, query: FriendsQuery) {
    const skip = query.page * MAX_COLLECTION_LENGTH;
    const {friends, totalCount} = await this.friendRepository.getMany(MAX_COLLECTION_LENGTH, skip, userId);

    return {
      currentPage: query.page,
      totalPages: Math.ceil(totalCount / MAX_COLLECTION_LENGTH),
      users: friends.map((friend) => BaseUserEntity.createFromPrisma(friend)),
    };
  }

  async delete(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    const friend = await this.friendRepository.getById(userId, friendId);
    if (!friend) {
      throw new NotFoundException(FRIEND_NOT_FOUND);
    }

    await this.friendRepository.delete(userId, friendId);
    const user = await this.sportsmanRepository.getById(userId);
    await this.notificationService.create(friend.id, `Пользователь ${user.name} удалил вас из друзей`);
  }
}
