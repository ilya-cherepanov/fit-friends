export const enum GymTitle {
  MinLength = 1,
  MaxLength = 15,
}

export const enum GymPrice {
  Min = 100,
  Max = 5000,
}

export enum GymDescription {
  MinLength = 1,
  MaxLength = 140,
}


export enum GymParameters {
  Pool = 'pool',
  FreeParking = 'free-parking',
  Massage = 'massage',
  KidsRoom = 'kids-room',
  Sauna = 'sauna',
}

export const enum GymPhotoCount {
  Min = 1,
  Max = 5,
}
export const GYM_PHOTO_FORMATS = ['jpg', 'jpeg', 'png'] as const;
export const GYM_PHOTO_FORMATS_REG_EXP =
  new RegExp(`(${GYM_PHOTO_FORMATS.join('|')})`);
export const GYM_PHOTO_SIZE = 2**10 * 2**10 * 5; // 5MB
