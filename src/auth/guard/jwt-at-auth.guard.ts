import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IS_PUBLIC_ROUTE } from '../decorator';

@Injectable()
export class JwtAtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
