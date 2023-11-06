import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @Column()
  permissionSubject: string;
}
