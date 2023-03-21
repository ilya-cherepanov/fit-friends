import {Injectable, NotFoundException} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {BaseUserEntity} from './user.entity';
import {USER_NOT_FOUND} from '../../constants';
import {UsersQuery} from './query/users.query';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';

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
}
