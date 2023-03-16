import {Injectable} from '@nestjs/common';
import {RegisterSportsmanDTO} from './dto/register-sportsman.dto';
import {SportsmanEntity} from '../users/user.entity';
import {SportsmanRepository} from './sportsman.repository';

@Injectable()
export class SportsmenService {
  constructor(private readonly sportsmanRepository: SportsmanRepository) {}


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
}
