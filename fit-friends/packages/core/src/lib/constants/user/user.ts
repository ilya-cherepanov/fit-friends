export const enum UserName {
  MinLength = 1,
  MaxLength = 15,
}

export const enum UserPassword {
  MinLength = 6,
  MaxLength = 15,
}

export enum UserRole {
  Coach = 'coach',
  Sportsman = 'sportsman',
  Anonymous = 'anonymous',
}

export enum UserSex {
  Male = 'male',
  Female = 'female',
  Any = 'any',
}

export const USER_AVATAR_MAX_SIZE = 2**10 * 2**10; // 1MB
export const USER_AVATAR_FORMATS = ['jpg', 'jpeg', 'png'] as const;
export const USER_AVATAR_FORMATS_REG_EXP =
  new RegExp(`(${USER_AVATAR_FORMATS.join('|')})`);
