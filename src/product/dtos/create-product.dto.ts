import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../enums/product.enum';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'The description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 9.99, description: 'The price of the product' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: ProductType.Subscription,
    enum: ProductType,
    description: 'The type of the product',
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    example: 10,
    description: 'The number of posts for the product (optional)',
  })
  @IsNumber()
  @IsOptional()
  numberOfPosts: number;

  @ApiProperty({ example: 1, description: 'The ID of the associated contract' })
  @IsInt()
  contractId: number;
}
