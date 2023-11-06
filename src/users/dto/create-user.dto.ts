import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Role } from '../../roles/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "User's name",
    default: 'John Snow',
  })
  @IsString()
  @ValidateIf((object, value) => value)
  name?: string;

  @ApiProperty({
    description: "User's email",
    default: 'john.snow@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User's new password",
    default: 'theNewSuperSecretPassword',
  })
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @ValidateIf((object, value) => value)
  profilePhoto?: string;

  @IsString()
  @ValidateIf((object, value) => value)
  refreshToken?: string;

  @IsString()
  @ValidateIf((object, value) => value)
  opsToken?: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  roleId?: number;

  role?: Role;
}
