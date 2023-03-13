import {PartialType} from '@nestjs/swagger';
import {RegisterCoachDTO} from './register-coach.dto';

export class UpdateCoachDTO extends PartialType(RegisterCoachDTO) {}
