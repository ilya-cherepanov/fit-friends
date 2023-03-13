import {PartialType} from '@nestjs/swagger';
import {RegisterSportsmanDTO} from './register-sportsman.dto';


export class UpdateSportsmanDTO extends PartialType(RegisterSportsmanDTO) {}
