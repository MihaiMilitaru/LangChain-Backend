import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class InvitedUserRequestDto {
  @ApiProperty({
    description: 'The invitation token',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: "The user's name",
    default: 'John Snow',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The user's password",
    default: 'theNewSuperSecretPassword',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
