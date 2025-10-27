import { PartialType } from '@nestjs/mapped-types';
import { CreateCategorieDto } from './create-category.dto';

export class UpdateCategorieDto extends PartialType(CreateCategorieDto) {}
