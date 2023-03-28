import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CoachRepository} from './coach.repository';
import {RegisterCoachDTO} from './dto/register-coach.dto';
import {BaseUserEntity, CoachEntity} from '../users/user.entity';
import {UserRepository} from '../users/user.repository';
import {USER_NOT_COACH, USER_NOT_FOUND} from '../../constants';
import {UpdateCoachDTO} from './dto/update-coach.dto';


@Injectable()
export class CoachesService {
  constructor(
    private readonly coachRepository: CoachRepository,
    private readonly userRepository: UserRepository
  ) {}

  async create(dto: RegisterCoachDTO, avatar: string, certificate: string) {
    const coachEntity = new CoachEntity({
      ...dto,
      avatar,
      certificate,
      birthDate: new Date(dto.birthDate),
    });

    await coachEntity.setPassword(dto.password);

    return BaseUserEntity.createFromPrisma(await this.coachRepository.create(coachEntity));
  }

  async update(coachId: number, dto: UpdateCoachDTO, avatar?: string, certificate?: string) {
    const coach = await this.userRepository.getById(coachId);

    if (!coach) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const coachEntity = BaseUserEntity.createFromPrisma(coach);

    if (!(coachEntity instanceof CoachEntity)) {
      throw new BadRequestException(USER_NOT_COACH);
    }

    coachEntity.update({
      ...dto,
      avatar,
      certificate,
      birthDate: new Date(dto.birthDate ?? coachEntity.birthDate),
    });

    return BaseUserEntity.createFromPrisma(await this.coachRepository.update(coachEntity));
  }
}
