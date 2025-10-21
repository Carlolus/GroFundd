import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';
import { Category } from './entities/categorie.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, User])],
    providers: [CategorieService],
    controllers: [CategorieController],
    exports: [CategorieService],
})
export class CategorieModule {}
