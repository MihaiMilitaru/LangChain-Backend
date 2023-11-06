import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Paginated } from 'nestjs-paginate';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        if (data instanceof StreamableFile) {
          return data;
        }
        if (data instanceof Paginated) {
          return {
            ...data,
            data: data.data.map((user) =>
              plainToInstance(this.dto, user, {
                excludeExtraneousValues: true,
              }),
            ),
          };
        }
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
