import {ConfigService, registerAs} from '@nestjs/config';
import {MulterModuleOptions} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import { v4 as uuidv4 } from 'uuid';

export const uploadOptions = registerAs('upload', () => ({
  directory: process.env.UPLOAD_FILES_DIR,
}));

export async function getUploadFilesConfig(configService: ConfigService): Promise<MulterModuleOptions> {
  return {
    dest: configService.get<string>('upload.directory'),
    storage: diskStorage({
      destination: configService.get<string>('upload.directory'),
      filename: (_, file, cb) => {
        const fileExt = extname(file.originalname);
        const newFileName = `${uuidv4()}${fileExt}`;
        cb(null, newFileName);
      }
    }),
  }
}
