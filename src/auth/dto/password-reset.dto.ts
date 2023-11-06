import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({
    description: 'The password reset token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The new password for the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
