import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure:
            config.get('MAIL_SECURE') == 'true' ||
            config.get('MAIL_SECURE') == '1' ||
            config.get('MAIL_SECURE') == 'yes',
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized:
              config.get('MAIL_HOST_VALID_CERT') != 'false' &&
              config.get('MAIL_HOST_VALID_CERT') != '0' &&
              config.get('MAIL_HOST_VALID_CERT') != 'no',
          },
        },
        defaults: {
          from: `"${config.get('application.name')}" <${config.get(
            'MAIL_FROM',
          )}>`,
        },
        template: {
          dir: join(__dirname, '../../mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
