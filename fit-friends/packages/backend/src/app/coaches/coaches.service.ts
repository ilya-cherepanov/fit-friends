import {Injectable} from '@nestjs/common';
import {CoachRepository} from './coach.repository';
import {RegisterCoachDTO} from './dto/register-coach.dto';
import {CoachEntity} from '../users/user.entity';


@Injectable()
export class CoachesService {
  constructor(private readonly coachRepository: CoachRepository) {}

  async create(dto: RegisterCoachDTO, avatar: string, certificate: string) {
    const coachEntity = new CoachEntity({
      ...dto,
      avatar,
      certificate,
      birthDate: new Date(dto.birthDate),
    });

    await coachEntity.setPassword(dto.password);

    return this.coachRepository.create(coachEntity);
  }
}
