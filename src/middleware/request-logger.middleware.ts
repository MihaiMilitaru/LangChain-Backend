import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: (error?: NextFunction) => void): any {
    const responseEnd = res.end;
    const requestTime = Date.now();

    res.end = (...restArgs) => {
      const { httpVersion, method, socket, originalUrl, body } = req;
      const { remoteAddress, remoteFamily } = socket;
      const { statusCode, statusMessage } = res;

      this.logger.log(
        JSON.stringify({
          remoteFamily,
          remoteAddress,
          httpVersion,
          method,
          originalUrl,
          body,
          response: {
            statusCode,
            statusMessage,
          },
          timestamp: Date.now(),
          duration: Date.now() - requestTime,
        }),
      );
      return responseEnd.apply(res, restArgs);
    };

    next();
  }
}
