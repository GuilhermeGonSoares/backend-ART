import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ContractService } from '../contract/contract.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    private readonly contractService: ContractService,
  ) {}

  async list(): Promise<ProductEntity[]> {
    return await this.repository.find();
  }

  async create(productDto: CreateProductDto): Promise<ProductEntity> {
    const product = await this.findProductBy('name', productDto.name).catch(
      () => undefined,
    );

    if (product) {
      throw new BadRequestException(
        `Already exist product with name: ${productDto.name}`,
      );
    }

    const contract = await this.contractService
      .findContractBy('name', productDto.contractName)
      .catch(() => undefined);

    return await this.repository.save({
      contractId: contract?.id || null,
      ...productDto,
    });
  }

  async findProductBy<k extends keyof ProductEntity>(
    key: k,
    value: ProductEntity[k],
  ): Promise<ProductEntity> {
    const product = await this.repository.findOne({ where: { [key]: value } });

    if (!product) {
      throw new NotFoundException(`Not found product with ${[key]}: ${value}`);
    }

    return product;
  }

  async update(
    id: number,
    productDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findProductBy('id', id);
    const { name } = productDto;

    if (name && name !== product.name) {
      const product = await this.findProductBy('name', name).catch(
        () => undefined,
      );
      if (product) {
        throw new BadRequestException(
          `Already exist product with this name: ${name}`,
        );
      }
    }

    return this.repository.save({ ...product, ...productDto });
  }

  async delete(id: number): Promise<ProductEntity> {
    const product = await this.findProductBy('id', id);

    return await this.repository.remove(product);
  }
}
