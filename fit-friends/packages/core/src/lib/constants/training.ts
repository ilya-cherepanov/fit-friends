export const enum TrainingTitle {
  MinLength = 1,
  MaxLength = 15,
}

export const enum TrainingDescription {
  MinLength = 10,
  MaxLength = 140,
}

export const TRAINING_PHOTO_FORMATS = ['png', 'jpg', 'jpeg'] as const;
export const TRAINING_PHOTO_FORMATS_REG_EXP =
  new RegExp(`(${TRAINING_PHOTO_FORMATS.join('|')})`);

export const MIN_PRICE = 0;
export const TRAINING_VIDEO_FORMATS = ['mov', 'avi', 'mp4'] as const;
export const TRAINING_VIDEO_FORMATS_REG_EXP =
  new RegExp(`(${TRAINING_VIDEO_FORMATS.join('|')})`);
