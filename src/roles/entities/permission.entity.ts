import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Action } from '../type';
import { SubjectType } from '@casl/ability';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  action: Action | Action[];

  @Column('simple-array')
  subject: SubjectType | SubjectType[];

  /** an array of fields to which user has (or not) access */
  @Column('simple-array', { nullable: true })
  fields?: string[];

  /** an object of conditions which restricts the rule scope */
  @Column('text', { nullable: true })
  conditions?: any;

  /** indicates whether rule allows or forbids something */
  @Column({ nullable: true })
  inverted?: boolean;

  /** message which explains why rule is forbidden */
  @Column({ nullable: true })
  reason?: string;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: Role[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
