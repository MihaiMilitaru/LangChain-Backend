import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities';

export class UserInfoDto {
  @ApiProperty({
    description: "'The user's id'",
  })
  id: number;

  @ApiProperty({
    description: "The user's name",
  })
  name: string;

  @ApiProperty({
    description: "The user's email address",
  })
  email: string;

  @ApiProperty({
    description: "The user's profile photo",
  })
  profilePhoto: string;

  @ApiProperty({
    description: "The user's role",
  })
  role: Role;
}
