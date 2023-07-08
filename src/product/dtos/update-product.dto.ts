import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../enums/product.enum';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    example: 'Product Name',
    description: 'The updated name of the product',
  })
  name?: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'The updated description of the product',
  })
  description?: string;

  @ApiProperty({
    example: 9.99,
    description: 'The updated price of the product',
  })
  price?: number;

  @ApiProperty({
    enum: ProductType,
    description: 'The updated type of the product',
  })
  type?: ProductType;

  @ApiProperty({
    example: 10,
    description: 'The updated number of posts for the product',
  })
  numberOfPosts?: number;

  @ApiProperty({
    example: 1,
    description: 'The updated ID of the associated contract',
  })
  contractId?: number;
}
