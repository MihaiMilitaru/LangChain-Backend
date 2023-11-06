import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Use $TOKEN$ as placeholder for the invite token.',
  })
  @IsUrl({
    require_tld: false,
  })
  signupUrl: string;
}
