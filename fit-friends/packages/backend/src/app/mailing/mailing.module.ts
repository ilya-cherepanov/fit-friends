import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import {MailerModule} from '@nestjs-modules/mailer';
import {getMailConfig} from '../../config/mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync(getMailConfig()),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
