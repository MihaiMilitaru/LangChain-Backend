import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Use $TOKEN$ as placeholder for the reset token.',
  })
  @IsUrl({
    require_tld: false,
  })
  passwordResetUrl: string;
}
