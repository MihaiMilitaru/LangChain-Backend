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

export class CreatePermissionRequestDto {
  @ApiProperty({
    description: 'Rule action',
    type: [String],
  })
  @Validate(StringOrArrayOfStrings)
  @IsNotEmpty()
  action: Action | Action[];

  @ApiProperty({
    description: 'Rule subject',
    type: [String],
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
    default: false,
  })
  @IsBoolean()
  inverted?: boolean;

  @ApiProperty({
    description: 'Forbidden error message',
  })
  @IsString()
  reason?: string;
}
