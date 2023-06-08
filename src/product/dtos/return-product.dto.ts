import { ProductType } from '../../enums/product.enum';
import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDto {
  private id: number;
  private name: string;
  private description: string;
  private price: number;
  private type: ProductType;
  private numberOfPosts: number;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.type = product.type;
    this.numberOfPosts = product.numberOfPosts;
  }
}
