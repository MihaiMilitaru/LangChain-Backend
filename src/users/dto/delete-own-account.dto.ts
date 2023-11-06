import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteOwnAccountDto {
  @ApiProperty({
    description: "User's current password",
    default: 'currentSuperSecretPassword',
  })
  @IsString()
  currentPassword: string;
}
