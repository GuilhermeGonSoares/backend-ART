import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ReturnProductDto } from './dtos/return-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() productDto: CreateProductDto,
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productService.create(productDto));
  }

  @Get()
  async listProduct(): Promise<ReturnProductDto[]> {
    return (await this.productService.list()).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Get(':id')
  async showProduct(@Param('id') id: string): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.productService.findProductBy('id', +id),
    );
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.productService.update(+id, productDto),
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productService.delete(+id));
  }
}
