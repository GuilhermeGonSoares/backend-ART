import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargeEntity } from './entities/charge.entity';
import { Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { ProductType } from '../enums/product.enum';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(ChargeEntity)
    private readonly repository: Repository<ChargeEntity>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
  ) {}

  async create(chargeDto: CreateChargeDto): Promise<ChargeEntity> {
    const { customerId, productId } = chargeDto;
    const discount = chargeDto.discount ? chargeDto.discount : 0;

    const [, product] = await Promise.all([
      this.customerService.findCustomerBy('cnpj', customerId),
      this.productService.findProductBy('id', productId),
    ]);

    if (product.type !== ProductType.Unique) {
      throw new BadRequestException('Product must be unique');
    }

    if (discount > product.price) {
      throw new BadRequestException(
        'Discount amount cannot be greater than the price',
      );
    }

    return await this.repository.save({
      ...chargeDto,
      price: product.price,
      finalPrice: product.price - discount,
    });
  }
}
