import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { StringOrArrayOfStrings } from '../../validator/string-or-array-of-strings.validator';
import { Action } from '../type';
import { SubjectType } from '@casl/ability';

export class UpdatePermissionRequestDto {
  @ApiProperty({
    description: 'Rule action',
  })
  @Validate(StringOrArrayOfStrings)
  @IsNotEmpty()
  action?: Action | Action[];

  @ApiProperty({
    description: 'Rule subject',
  })
  @Validate(StringOrArrayOfStrings)
  subject: SubjectType | SubjectType[];

  @ApiProperty({
    description: 'Rule model fields',
  })
  @IsArray()
  fields?: string[];

  @ApiProperty({
    description: 'Rule conditions - does not support model property conditions',
  })
  conditions?: any;

  @ApiProperty({
    description: 'Is the rule inverted? as in !Rule',
  })
  @IsBoolean()
  inverted?: boolean;

  @ApiProperty({
    description: 'Forbidden error message',
  })
  @IsString()
  reason?: string;
}
