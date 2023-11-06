import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUserByPassword(
      username,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
