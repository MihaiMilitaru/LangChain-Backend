import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import {
  GoogleStrategy,
  JwtRtStrategy,
  JwtUserOpsStrategy,
  LocalStrategy,
} from './strategy';
import { JwtAtStrategy } from './strategy';
import { JwtAtAuthGuard } from './guard';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from '../mail/mail.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [UsersModule, MailModule, AbilityModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAtStrategy,
    JwtRtStrategy,
    JwtUserOpsStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
