import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/categorie.entity';

@Entity('budgets')
@Entity('budgets')
@Index('idx_budgets_unique', ['user', 'category', 'month', 'year'], { 
  unique: true,
})
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, eager: false })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @ManyToOne(() => Category, { nullable: false, eager: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  limit_amount: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

