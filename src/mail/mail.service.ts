import { HttpException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendUserInvite(email: string, signupUrl: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your invitation to our CMS System',
        template: './userInvite',
        context: {
          signupUrl: signupUrl,
        },
      });
    } catch (e) {
      throw new HttpException('Email delivery error.', 500);
    }
  }

  async sendUserPasswordReset(user: User, passwordResetUrl: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password reset',
        template: './passwordReset',
        context: {
          user: user,
          passwordResetUrl: passwordResetUrl,
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException('Email delivery error.', 500);
    }
  }
}
