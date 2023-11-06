import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../../users/dto';
import { USER_OPS_TOKEN_TYPE_INVITE } from '../../users/user-security.service';

@Injectable()
export class JwtUserOpsStrategy extends PassportStrategy(
  Strategy,
  'jwt-user-ops',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_USER_OPS_SECRET'),
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const token = req.body['token'];

    switch (payload.type) {
      case USER_OPS_TOKEN_TYPE_INVITE:
        return { email: payload.sub, tokenType: payload.type };
      default:
        const user = await this.authService.getUserByUserOpsToken(
          payload.sub,
          token,
        );
        if (!user) {
          throw new UnauthorizedException();
        }
        return { ...user, tokenType: payload.type };
    }
  }
}
