import {OmitType, PartialType} from '@nestjs/swagger';
import {RegisterCoachDTO} from './register-coach.dto';

export class UpdateCoachDTO extends PartialType(
  OmitType(RegisterCoachDTO, ['password', 'role', 'email'] as const)
) {}
