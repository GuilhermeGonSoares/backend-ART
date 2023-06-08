import { ProductType } from '../../enums/product.enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  @IsOptional()
  numberOfPosts: number;
}
