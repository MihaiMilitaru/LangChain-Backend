import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../../users/dto';

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.authService.getUserByAccessToken(
      parseInt(payload.sub),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
