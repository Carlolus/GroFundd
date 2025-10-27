import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ai_logs')
export class AiLog {
  @ApiProperty({ example: '3b4b2f2c-2d8a-4f23-8fcd-65c8c1b5a4aa' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: 'categorization',
    description: "Type of log: 'categorization', 'insight', or 'recommendation'",
  })
  @Column({ type: 'varchar', length: 20 })
  type: string;

  @ApiProperty({ example: 'User spent $50 on groceries' })
  @Column({ type: 'text' })
  input_text: string;

  @ApiProperty({ example: 'Categorized as: Food & Dining' })
  @Column({ type: 'text' })
  output_text: string;

  @ApiProperty({ example: 'gpt-4-turbo' })
  @Column({ type: 'varchar', length: 50 })
  model: string;

  @ApiProperty({ example: '2025-10-27T12:00:00Z' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
