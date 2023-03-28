export const enum CoachAccomplishments {
  MinLength = 10,
  MaxLength = 140,
}

export const COACH_CERTIFICATE_FORMATS = ['pdf'] as const;
export const COACH_CERTIFICATE_MIME_TYPES = ['application/pdf'];
export const COACH_CERTIFICATE_FORMATS_REG_EXP =
  new RegExp(`(${COACH_CERTIFICATE_FORMATS.join('|')})`);
