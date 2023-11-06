import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  profilePhoto: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    nullable: true,
  })
  opsToken: string;

  @ManyToOne(() => Role, (role) => role.users, { cascade: ['update'] })
  @JoinColumn()
  role: Role;

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

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
