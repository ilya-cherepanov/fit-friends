import {MailerAsyncOptions} from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import {ConfigService, registerAs} from '@nestjs/config';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';


export const mailOptions = registerAs('mail', () => ({
  host: process.env.MAIL_SMTP_HOST,
  port: process.env.MAIL_SMTP_PORT,
  user: process.env.MAIL_SMTP_USER,
  password: process.env.MAIL_SMTP_USER_PASSWORD,
  from: process.env.MAIL_FROM,
  frontendUrl: process.env.FRONTEND_URL,
}));

export function getMailConfig(): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => ({
      transport: {
        host: configService.get<string>('mail.host'),
        port: configService.get<number>('mail.port'),
        secure: false,
        auth: {
          user: configService.get<string>('mail.user'),
          pass: configService.get<string>('mail.password')
        }
      },
      defaults: {
        from: configService.get<string>('mail.from'),
      },
      template: {
        dir: path.resolve(__dirname, 'assets/mail-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }),
    inject: [ConfigService],
  }
}
