import { ApiProperty } from '@nestjs/swagger';

export class UserPaginateQueryDto {
  // @ApiProperty({
  //   description: 'Filter query',
  //   required: false,
  // })
  // filter?: { [p: string]: string | string[] };
  //
  // @ApiProperty({
  //   description: 'Items per page',
  //   required: false,
  // })
  // limit?: number;

  @ApiProperty({
    description: 'Items per page',
    required: false,
  })
  page?: number;

  // @ApiProperty({
  //   description: 'Search for value',
  //   required: false,
  // })
  // search?: string;
  //
  // @ApiProperty({
  //   description: 'Search in properties',
  //   required: false,
  // })
  // searchBy?: string[];
  //
  // @ApiProperty({
  //   description: 'Sort by properties',
  //   required: false,
  // })
  // sortBy?: [string, string][];
}
