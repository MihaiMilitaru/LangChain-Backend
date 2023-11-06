import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
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

  @ApiProperty({
    description: "User's active status",
    default: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: "User's role id",
    default: 3,
  })
  @IsNumber()
  roleId?: number;
}
