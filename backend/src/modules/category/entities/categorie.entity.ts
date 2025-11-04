import { Entity, Column, PrimaryColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  id: number;

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
