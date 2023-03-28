import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {BaseUserEntity} from './user.entity';
import {SAME_USER_CANNOT_BE_FRIEND, USER_NOT_FOUND} from '../../constants';
import {UsersQuery} from './query/users.query';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';
import {FriendsQuery} from './query/friends.query';


@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async get(userId: number) {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return BaseUserEntity.createFromPrisma(user);
  }

  async getAll(query: UsersQuery) {
    const skip = MAX_COLLECTION_LENGTH * query.page;

    const filters = {
      level: query.level,
      trainingTypes: query.trainingTypes,
      locations: query.locations,
    };

    const userEntities = (await this.userRepository.getAll(MAX_COLLECTION_LENGTH, skip, filters, query.sortBy))
      .map((user) => BaseUserEntity.createFromPrisma(user));

    const count = await this.userRepository.count(filters);

    return {
      currentPage: query.page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      users: userEntities,
    };
  }

  async addFriend(friendId: number, userId: number) {
    if (friendId === userId) {
      throw new BadRequestException(SAME_USER_CANNOT_BE_FRIEND);
    }

    await this.userRepository.createFriend(friendId, userId);
  }

  async getFriends(query: FriendsQuery, userId: number) {
    const skip = MAX_COLLECTION_LENGTH * query.page;
    const userEntities = (await this.userRepository.getFriends(MAX_COLLECTION_LENGTH, skip, userId))
      .map((user) => BaseUserEntity.createFromPrisma(user));

    const count = await this.userRepository.getFriendsCount(userId);

    return {
      currentPage: query.page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      users: userEntities,
    };
  }
}
