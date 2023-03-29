import {OmitType, PartialType} from '@nestjs/swagger';
import {RegisterSportsmanDTO} from './register-sportsman.dto';


export class UpdateSportsmanDTO extends PartialType(
  OmitType(RegisterSportsmanDTO, ['password', 'email', 'role'] as const)
) {}
