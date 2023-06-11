import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {FriendRepository} from './friend.repository';
import {FriendsQuery} from '../users/query/friends.query';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';
import {NotificationsService} from '../notifications/notifications.service';
import {
  FRIEND_NOT_FOUND,
  SAME_USER_CANNOT_BE_FRIEND,
  USERS_ALREADY_FRIENDS
} from '../../constants';
import {BaseUserEntity} from '../users/user.entity';
import {UserRepository} from '../users/user.repository';


@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    const sportsman = await this.userRepository.getById(friendId);
    if (!sportsman) {
      throw new NotFoundException(FRIEND_NOT_FOUND);
    }

    const friend = await this.friendRepository.getById(userId, friendId);
    if (friend) {
      throw new ConflictException(USERS_ALREADY_FRIENDS);
    }

    const createdFriend = await this.friendRepository.create(userId, friendId);

    await this.notificationService.create(friendId,
      `Пользователь ${sportsman.name} добавил вас в друзья`
    );

    return createdFriend;
  }

  async getMany(userId: number, query: FriendsQuery) {
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

    const {count} = await this.friendRepository.delete(userId, friendId);
    if (count < 1) {
      throw new InternalServerErrorException();
    }

    const user = await this.userRepository.getById(userId);
    await this.notificationService.create(friendId, `Пользователь ${user.name} удалил вас из друзей`);
  }

  async check(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    const friend = await this.friendRepository.getById(userId, friendId);

    return {
      status: !!friend,
    };
  }
}
