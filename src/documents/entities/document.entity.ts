import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from '../../chapters/entities/chapter.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  path: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column()
  uploadDate: Date;

  @ManyToMany(() => Chapter, { cascade: true })
  @JoinTable({
    joinColumn: { name: 'documentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chapterId', referencedColumnName: 'id' },
  })
  chapters: Chapter[];
}
