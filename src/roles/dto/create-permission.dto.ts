import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { StringOrArrayOfStrings } from '../../validator/string-or-array-of-strings.validator';
import { Role } from '../entities';
import { Action } from '../type';
import { SubjectType } from '@casl/ability';

export class CreatePermissionDto {
  @Validate(StringOrArrayOfStrings)
  @IsNotEmpty()
  action: Action | Action[];

  @Validate(StringOrArrayOfStrings)
  subject: SubjectType | SubjectType[];

  @IsArray()
  fields?: string[];

  conditions?: any;

  @IsBoolean()
  inverted?: boolean;

  @IsString()
  reason?: string;

  @IsArray()
  roles: Role[];
}
