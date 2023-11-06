import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfilePasswordDto {
  @ApiProperty({
    description: "User's current password",
    default: 'currentSuperSecretPassword',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: "User's new password",
    default: 'theNewSuperSecretPassword',
  })
  @IsString()
  newPassword: string;
}
