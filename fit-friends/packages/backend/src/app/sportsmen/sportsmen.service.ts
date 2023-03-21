import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {RegisterSportsmanDTO} from './dto/register-sportsman.dto';
import {BaseUserEntity, SportsmanEntity} from '../users/user.entity';
import {SportsmanRepository} from './sportsman.repository';
import {UpdateSportsmanDTO} from './dto/update-sportsman.dto';
import {UserRepository} from '../users/user.repository';
import {USER_NOT_FOUND, USER_NOT_SPORTSMAN} from '../../constants';

@Injectable()
export class SportsmenService {
  constructor(
    private readonly sportsmanRepository: SportsmanRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: RegisterSportsmanDTO, avatar?: string) {
    const sportsmanEntity = new SportsmanEntity({
      ...dto,
      birthDate: new Date(dto.birthDate),
      readyToTraining: false,
      avatar,
    });

    await sportsmanEntity.setPassword(dto.password);

    return this.sportsmanRepository.create(sportsmanEntity);
  }

  async update(sportsmanId: number, dto: UpdateSportsmanDTO, avatar?: string) {
    const sportsman = await this.userRepository.getById(sportsmanId);

    if (!sportsman) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const sportsmanEntity = BaseUserEntity.createFromPrisma(sportsman);

    if (!(sportsmanEntity instanceof SportsmanEntity)) {
      throw new BadRequestException(USER_NOT_SPORTSMAN);
    }

    sportsmanEntity.update({
      ...dto,
      avatar,
      birthDate: new Date(dto.birthDate ?? sportsmanEntity.birthDate),
    });

    await this.sportsmanRepository.update(sportsmanEntity);
  }
}
