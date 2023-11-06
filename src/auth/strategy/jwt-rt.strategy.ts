import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../../users/dto';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.headers['authorization'].split(' ').pop();
    const user = await this.authService.getUserByRefreshToken(
      parseInt(payload.sub),
      refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
