import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargeEntity } from './entities/charge.entity';
import { Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { ProductType } from '../enums/product.enum';
import { UpdateChargeDto } from './dto/update-charge.dto';

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

  async findChargeByCnpj(
    customerId: string,
    isRelations: boolean,
  ): Promise<ChargeEntity[]> {
    const relations = isRelations ? { product: true } : undefined;
    const charge = await this.repository.find({
      where: { customerId },
      relations,
    });

    if (!charge) {
      throw new NotFoundException(
        `Not found charge with this customerId: ${customerId}`,
      );
    }

    return charge;
  }

  async findChargeById(id: number): Promise<ChargeEntity> {
    const charge = await this.repository.findOne({ where: { id } });

    if (!charge) {
      throw new NotFoundException(`Not found charge with this id: ${id}`);
    }

    return charge;
  }

  async update(id: number, chargeDto: UpdateChargeDto): Promise<ChargeEntity> {
    const charge = await this.findChargeById(id);
    let { price } = charge;
    const { customerId, productId, discount } = chargeDto;

    if (customerId && customerId !== charge.customerId) {
      console.log('oi)');

      await this.customerService.findCustomerBy('cnpj', customerId);
    }

    if (productId && productId !== charge.productId) {
      const product = await this.productService.findProductBy('id', productId);
      if (product.type !== ProductType.Unique) {
        throw new BadRequestException('Product must be unique');
      }

      if (discount && discount > product.price) {
        throw new BadRequestException(
          'Discount amount cannot be greater than the price',
        );
      }
      price = product.price;
    } else if (discount && discount > charge.price) {
      throw new BadRequestException(
        'Discount amount cannot be greater than the price',
      );
    }
    const finalPrice = price - (discount || charge.discount);

    return await this.repository.save({
      ...charge,
      ...chargeDto,
      price,
      finalPrice,
    });
  }

  async delete(id: number): Promise<ChargeEntity> {
    const charge = await this.findChargeById(id);

    return await this.repository.remove(charge);
  }
}
