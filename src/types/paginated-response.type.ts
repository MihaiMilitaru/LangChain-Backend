import { Column, SortBy } from 'nestjs-paginate/lib/helper';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export class PaginatedResponse<T> {
  data: T[];

  @ApiProperty({
    default: {
      itemsPerPage: 20,
      totalItems: 203,
      currentPage: 1,
      totalPages: 11,
      sortBy: [['id', 'ASC']],
    },
  })
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: SortBy<T>;
    searchBy: Column<T>[];
    search: string;
    filter?: {
      [column: string]: string | string[];
    };
  };
  @ApiProperty({
    default: {
      first: 'http://localhost:3000/users?page=1&limit=20&sortBy=id:ASC',
      previous: 'http://localhost:3000/users?page=3&limit=20&sortBy=id:ASC',
      current: 'http://localhost:3000/users?page=4&limit=20&sortBy=id:ASC',
      next: 'http://localhost:3000/users?page=5&limit=20&sortBy=id:ASC',
      last: 'http://localhost:3000/users?page=11&limit=20&sortBy=id:ASC',
    },
  })
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
