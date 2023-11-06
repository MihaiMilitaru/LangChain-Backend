import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: "User's name",
    default: 'John Snow',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: "User's email",
    default: 'john.snow@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
