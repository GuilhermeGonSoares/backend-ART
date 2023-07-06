import { ProductType } from '../../enums/product.enum';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsInt()
  contractId: number;
}
