import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieService } from './category.service';
import { CategorieController } from './category.controller';
import { Category, CategoryForFront } from './entities/categorie.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, User, CategoryForFront])],
    providers: [CategorieService],
    controllers: [CategorieController],
    exports: [CategorieService],
})
export class CategoryModule {}
