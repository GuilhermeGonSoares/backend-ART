import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../enums/product.enum';
import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDto {
  @ApiProperty({ example: 1, description: 'The ID of the product' })
  id: number;

  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'The description of the product',
  })
  description: string;

  @ApiProperty({ example: 1, description: 'The ID of the associated contract' })
  contractId: number;

  @ApiProperty({ example: 9.99, description: 'The price of the product' })
  price: number;

  @ApiProperty({
    example: ProductType.Subscription,
    enum: ProductType,
    description: 'The type of the product',
  })
  type: ProductType;

  @ApiProperty({
    example: 10,
    description: 'The number of posts for the product',
  })
  numberOfPosts: number;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.contractId = product.contractId;
    this.price = product.price;
    this.type = product.type;
    this.numberOfPosts = product.numberOfPosts;
  }
}
