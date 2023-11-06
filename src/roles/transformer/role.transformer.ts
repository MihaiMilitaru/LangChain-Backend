import { Permission } from '../entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionTransformer } from './permission.transformer';

export class RoleTransformer {
  @ApiProperty({
    description: 'Role id',
    default: 0,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "Role's name",
    default: 'User',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "Role's role details",
    type: [PermissionTransformer],
  })
  @Type(() => PermissionTransformer)
  @Expose()
  permissions?: Permission[];

  @ApiProperty({
    description: "Role's creation timestamp",
    default: '2022-11-11T12:16:34.025Z',
  })
  @Expose()
  createdAt: Date;
}

export class RoleWithoutPermissionTransformer extends OmitType(
  RoleTransformer,
  ['permissions'],
) {}
