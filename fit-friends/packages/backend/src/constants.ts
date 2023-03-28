import {USER_AVATAR_MAX_SIZE, USER_AVATAR_MIME_TYPES} from '@fit-friends/core';

export const ENV_FILE_PATH = '../.env';
export const JWT_ACCESS_EXPIRES_IN_DEFAULT = '15m';
export const JWT_REFRESH_EXPIRES_IN_DEFAULT = '7d';
export const JWT_HASH_ALGORITHM = 'HS256';
export const ROLES_KEY = 'roles';
export const SALT_ROUNDS = 10;
export const UPLOAD_FILES_DIR_DEFAULT = './upload';
export const PRISMA_VIOLATION_OF_UNIQUENESS_CODE = 'P2002';
export const PRISMA_NOT_FOUND_CODE = 'P2025';
export const USER_WITH_EMAIL_ALREADY_EXISTS = 'The user with this email already exists!';
export const SAME_USER_CANNOT_BE_FRIEND = 'The user cannot add himself as a friend!';
export const INVALID_CREDENTIALS = 'Invalid email or password!';
export const USER_NOT_FOUND = 'User not found!';
export const USER_NOT_COACH = 'The user is not a coach!';
export const USER_NOT_SPORTSMAN = 'The user is not a sportsman!';
export const COACH_NOT_HAS_SPECIALIZATION = 'The coach does not have the specified specialization!';
export const TRAINING_NOT_FOUND = 'There is no training with this id!';
export const COACH_NOT_OWNER = 'The coach is not the owner of the training!';
export const AVATAR_REQUIRED = 'The avatar field is required!';
export const AVATAR_MUST_BE_LESS = `The avatar field must be less than ${USER_AVATAR_MAX_SIZE}!`;
export const AVATAR_INCOMPATIBLE_MIME =
  `The avatar field mime type must be among: ${USER_AVATAR_MIME_TYPES.join(', ')}`;
export const CERTIFICATE_REQUIRED = 'The certificate field is required!';
export const CERTIFICATE_INCOMPATIBLE_MIME =
  `The certificate field mime type must be among: ${USER_AVATAR_MIME_TYPES.join(', ')}`;
export const GLOBAL_PREFIX = 'api';
