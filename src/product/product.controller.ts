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
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Product created',
    type: ReturnProductDto,
  })
  @ApiBody({ type: CreateProductDto })
  async createProduct(
    @Body() productDto: CreateProductDto,
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productService.create(productDto));
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: ReturnProductDto,
    isArray: true,
  })
  async listProduct(): Promise<ReturnProductDto[]> {
    return (await this.productService.list()).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ReturnProductDto,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async showProduct(@Param('id') id: string): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.productService.findProductBy('id', +id),
    );
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Product updated',
    type: ReturnProductDto,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.productService.update(+id, productDto),
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Product deleted',
    type: ReturnProductDto,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async deleteProduct(@Param('id') id: string): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productService.delete(+id));
  }
}
