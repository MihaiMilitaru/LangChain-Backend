import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { TokenData, UserTokens } from './dto';
import { SecurityConfig } from '../config/config.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const USER_OPS_TOKEN_TYPE_INVITE = 1;
export const USER_OPS_TOKEN_TYPE_PASSWORD_RESET = 2;

@Injectable()
export class UserSecurityService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  validateSecret(secret: string, hashedSecret: string): Promise<boolean> {
    return verify(hashedSecret, secret);
  }

  hashSecret(password: string): Promise<string> {
    return hash(password);
  }

  generateTokens(payload: TokenData): UserTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: TokenData): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: TokenData): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  generateUserOpsToken(payload: TokenData, type: string): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_USER_OPS_SECRET'),
      expiresIn: securityConfig[type + 'ExpiresIn'],
    });
  }
}
