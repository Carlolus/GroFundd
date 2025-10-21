import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  icon?: string;

  @Column({ default: false })
  isAiGenerated: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
