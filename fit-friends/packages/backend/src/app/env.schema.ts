import * as Joi from 'joi';
import {JWT_ACCESS_EXPIRES_IN_DEFAULT, JWT_REFRESH_EXPIRES_IN_DEFAULT, UPLOAD_FILES_DIR_DEFAULT} from '../constants';

export const envSchema = Joi.object({
  JWT_ACCESS_SECRET: Joi
    .string()
    .required(),
  JWT_REFRESH_SECRET: Joi
    .string()
    .required(),
  JWT_ACCESS_EXPIRES_IN: Joi
    .string()
    .default(JWT_ACCESS_EXPIRES_IN_DEFAULT),
  JWT_REFRESH_EXPIRES_IN: Joi
    .string()
    .default(JWT_REFRESH_EXPIRES_IN_DEFAULT),
  UPLOAD_FILES_DIR: Joi
    .string()
    .default(UPLOAD_FILES_DIR_DEFAULT),
  MAIL_SMTP_HOST: Joi
    .string()
    .required(),
  MAIL_SMTP_PORT: Joi
    .number()
    .port()
    .required(),
  MAIL_SMTP_USER: Joi
    .string()
    .required(),
  MAIL_SMTP_USER_PASSWORD: Joi
    .string()
    .required(),
  MAIL_FROM: Joi
    .string()
    .required(),
  FRONTEND_URL: Joi
    .string()
    .required(),
});
