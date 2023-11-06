import { Injectable } from '@nestjs/common';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';
import {
  USER_OPS_TOKEN_TYPE_PASSWORD_RESET,
  UserSecurityService,
} from '../users/user-security.service';
import { ConfigService } from '@nestjs/config';
import { PasswordResetRequestDto } from './dto';
import { MailService } from '../mail/mail.service';
import { PasswordResetDto } from './dto';
import { CreateUserDto, UserTokens } from '../users/dto';
import { UserAlreadyExistsException } from './exception';
import { Auth, google } from 'googleapis';
@Injectable()
export class AuthService {
  private readonly oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly userSecurityService: UserSecurityService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
  }

  async ensureGoogleUserExists(payload: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }): Promise<User> {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (user) {
      return user;
    } else {
      return await this.usersService.create({
        email: payload.email,
        isActive: true,
        name: payload.firstName + ' ' + payload.lastName,
        profilePhoto: payload.picture,
        roleId: 3 //user
      });
    }
  }

  async login(userId: number): Promise<UserTokens> {
    const tokens = this.userSecurityService.generateTokens({
      sub: userId.toString(),
    });
    //console.log({tokens});
    await this.usersService.update(userId, {
      refreshToken: await this.userSecurityService.hashSecret(
        tokens.refreshToken,
      ),
    });
    return tokens;
  }

  async register(userData: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }


    const newUser = await this.usersService.create(userData);
    const tokens = this.userSecurityService.generateTokens({
      sub: newUser.id.toString(),
    });

    await this.usersService.update(newUser.id, {
      refreshToken: await this.userSecurityService.hashSecret(
        tokens.refreshToken,
      ),
    });

    return tokens;
  }

  async validateUserByPassword(
    email: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findOneByEmail(email);

    if (
      user &&
      user?.isActive &&
      (await this.userSecurityService.validateSecret(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async getUserByAccessToken(userId: number): Promise<Partial<User>> {
    const user = await this.usersService.findOneWithOptions(
      { id: userId },
      {
        relations: ['role.permissions'],
      },
    );

    if (user && user?.isActive && !!user?.refreshToken) {
      return user;
    }

    return null;
  }

  async getUserByRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findOne(userId);

    if (
      user &&
      user?.isActive &&
      !!user?.refreshToken &&
      (await this.userSecurityService.validateSecret(
        refreshToken,
        user.refreshToken,
      ))
    ) {
      return user;
    }

    return null;
  }

  async getUserByUserOpsToken(email: string, opsToken: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (
      user &&
      user?.isActive &&
      !!user?.opsToken &&
      (await this.userSecurityService.validateSecret(opsToken, user.opsToken))
    ) {
      return user;
    }
    return null;
  }

  async logout(userId: number) {
    await this.usersService.update(userId, {
      refreshToken: null,
    });
  }

  async passwordResetRequest(data: PasswordResetRequestDto) {
    const user = await this.usersService.findOneByEmail(data.email);

    if (!user) {
      return;
    }

    const passwordResetToken = this.userSecurityService.generateUserOpsToken(
      {
        sub: data.email,
        type: USER_OPS_TOKEN_TYPE_PASSWORD_RESET,
      },
      'passwordReset',
    );

    await this.usersService.update(user.id, {
      opsToken: await this.userSecurityService.hashSecret(passwordResetToken),
    });

    await this.mailService.sendUserPasswordReset(
      user,
      data.passwordResetUrl.replace('$TOKEN$', passwordResetToken),
    );
  }

  async passwordReset(user: User, data: PasswordResetDto) {
    return this.usersService.update(user.id, {
      password: data.newPassword,
      opsToken: null,
    });
  }
}
