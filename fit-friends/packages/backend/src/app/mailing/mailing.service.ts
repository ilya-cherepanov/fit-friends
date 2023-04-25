import {Injectable} from '@nestjs/common';
import {Subscriber} from '../../types/subscriber';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';


@Injectable()
export class MailingService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendTrainingNotifications(subscribers: Subscriber[]) {
    subscribers.forEach((subscriber) => this.mailerService.sendMail({
      to: subscriber.email,
      subject: 'Новые тренировки',
      template: './notification.hbs',
      context: {
        ...subscriber,
        url: this.configService.get<string>('mail.frontendUrl'),
      },
    }));
  }
}
