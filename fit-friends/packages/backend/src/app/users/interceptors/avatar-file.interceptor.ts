import {Injectable, NestInterceptor} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';

@Injectable()
export class AvatarFileInterceptor extends FileInterceptor('avatar') {
  constructor() {
    super();
  }
}
