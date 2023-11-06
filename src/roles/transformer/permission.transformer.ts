import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Action } from '../type';
import { Subject } from '@casl/ability/dist/types';
import { Role } from '../entities';
import { RoleTransformer } from './role.transformer';

export class PermissionTransformer {
  @ApiProperty({
    description: 'Rule id',
    default: 0,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Rule action',
    default: ['create', 'read', 'update', 'delete', 'manage'],
  })
  @Expose()
  action: Action | Action[];

  @ApiProperty({
    description: 'Rule subject',
    default: ['Post'],
  })
  @Expose()
  subject?: Subject | Subject[];

  @ApiProperty({
    description: 'Subject fields the rule is referring to',
    default: '',
  })
  @Expose()
  fields?: string[];

  @ApiProperty({
    description: 'Rule conditions',
    default: {},
  })
  @Expose()
  conditions?: any;

  @ApiProperty({
    description: 'Inverted rule (cannot)',
    default: false,
  })
  @Expose()
  inverted?: boolean;

  @ApiProperty({
    description: 'Error message',
    default: 'Access denied',
  })
  @Expose()
  reason?: string;

  @ApiProperty({
    description: "Permission's assigned roles",
    type: RoleTransformer,
  })
  @Type(() => RoleTransformer)
  @Expose()
  roles?: Role[];

  @ApiProperty({
    description: "Role's creation timestamp",
    default: '2022-11-11T12:16:34.025Z',
  })
  @Expose()
  createdAt: Date;
}
