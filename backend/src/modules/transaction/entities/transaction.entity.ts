import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/categorie.entity'

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ length: 10 })
  type: 'income' | 'expense';

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 100, nullable: true })
  aiCategorySuggestion?: string;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
