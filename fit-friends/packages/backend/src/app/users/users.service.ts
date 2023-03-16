import {Injectable, NotFoundException} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {BaseUserEntity} from './user.entity';
import {USER_NOT_FOUND} from '../../constants';

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
}
