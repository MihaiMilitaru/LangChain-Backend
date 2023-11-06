import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRtAuthGuard extends AuthGuard('jwt-rt') {}
