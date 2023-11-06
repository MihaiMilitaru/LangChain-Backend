import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtUserOpsAuthGuard extends AuthGuard('jwt-user-ops') {}
