import { Role } from '../../roles/entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  RoleTransformer,
  RoleWithoutPermissionTransformer,
} from '../../roles/transformer';

export class UserTransformer {
  @ApiProperty({
    description: 'User id',
    default: 0,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "User's name",
    default: 'John Snow',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "User's email",
    default: 'john.snow@gmail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "User's profile photo url",
    default: '',
  })
  @Expose()
  profilePhoto: string;

  @ApiProperty({
    description: "User's active status",
    default: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: "User's role details",
    type: RoleTransformer,
  })
  @Type(() => RoleTransformer)
  @Expose()
  role: Role;

  @ApiProperty({
    description: "User's creation timestamp",
    default: '2022-11-11T12:16:34.025Z',
  })
  @Expose()
  createdAt: Date;
}

export class UserWithoutRoleTransformer extends OmitType(UserTransformer, [
  'role',
]) {}

export class UserWithoutRolePermissionTransformer extends UserTransformer {
  @ApiProperty({
    description: "User's role details",
    type: RoleWithoutPermissionTransformer,
  })
  @Type(() => RoleWithoutPermissionTransformer)
  role: Role;
}
