import {BadRequestException, PipeTransform} from '@nestjs/common';
import {COACH_CERTIFICATE_MIME_TYPES, USER_AVATAR_MAX_SIZE, USER_AVATAR_MIME_TYPES} from '@fit-friends/core';
import {
  AVATAR_INCOMPATIBLE_MIME,
  AVATAR_MUST_BE_LESS,
  AVATAR_REQUIRED,
  CERTIFICATE_INCOMPATIBLE_MIME,
  CERTIFICATE_REQUIRED
} from '../../../constants';


export class CoachFilesValidationPipe implements PipeTransform {
  constructor(
    private readonly params = {avatar: {isOptional: false}, certificate: {isOptional: false}}
  ) {}

  transform(value: {avatar?: Express.Multer.File[], certificate?: Express.Multer.File[]}) {
    if (!this.params.avatar.isOptional) {
      if (!value.avatar) {
        throw new BadRequestException(AVATAR_REQUIRED);
      }

      if (value.avatar.length === 0) {
        throw new BadRequestException(AVATAR_REQUIRED);
      }

      if (value.avatar[0].size > USER_AVATAR_MAX_SIZE) {
        throw new BadRequestException(AVATAR_MUST_BE_LESS);
      }

      if (!USER_AVATAR_MIME_TYPES.includes(value.avatar[0].mimetype)) {
        throw new BadRequestException(AVATAR_INCOMPATIBLE_MIME);
      }
    }

    if (!this.params.certificate.isOptional) {
      if (!value.certificate) {
        throw new BadRequestException(CERTIFICATE_REQUIRED);
      }

      if (value.certificate.length === 0) {
        throw new BadRequestException(CERTIFICATE_REQUIRED);
      }

      if (!COACH_CERTIFICATE_MIME_TYPES.includes(value.certificate[0].mimetype)) {
        throw new BadRequestException(CERTIFICATE_INCOMPATIBLE_MIME);
      }
    }

    return value;
  }
}
