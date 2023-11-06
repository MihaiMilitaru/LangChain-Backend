import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSecurityService } from './user-security.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '../config/config.interface';
import { MailModule } from '../mail/mail.module';
import { ProfileController } from './profile/profile.controller';
import { AbilityModule } from '../ability/ability.module';
import { Role } from '../roles/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    MailModule,
    AbilityModule,
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, UserSecurityService],
  exports: [UsersService, UserSecurityService],
})
export class UsersModule {}
