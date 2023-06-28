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
import { SubscriptionEntity } from '../subscription/entities/subscription.entity';
import { AsaasService } from '../asaas/asaas.service';
import { CreateAsaasChargeDto } from '../asaas/dtos/create-charge.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(ChargeEntity)
    private readonly repository: Repository<ChargeEntity>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly asaasService: AsaasService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}

  async create(chargeDto: CreateChargeDto): Promise<ChargeEntity> {
    const { customerId, productId } = chargeDto;
    const discount = chargeDto.discount ? chargeDto.discount : 0;

    const [, product] = await Promise.all([
      this.customerService.findCustomerBy('cnpj', customerId),
      this.productService.findProductBy('id', productId),
    ]);

    const price = product.price;
    const finalPrice = product.price - discount;

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
      price,
      finalPrice,
    });
  }

  async createChargeForSubscription(subscription: SubscriptionEntity) {
    const currentDate = new Date();
    const dueDay = String(subscription.preferredDueDate).padStart(2, '0');
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();
    const dueDate = new Date(`${currentYear}-${currentMonth}-${dueDay}`);
    dueDate.setUTCHours(3);
    const charge = new ChargeEntity();
    charge.setChargeFromSubscription(subscription, dueDate);

    const chargeDto = new CreateChargeDto();
    chargeDto.convertChargeToChargeDto(charge);
    const customer = await this.customerService.findCustomerBy(
      'cnpj',
      subscription.customerId,
    );

    const asaasCharge = await this.asaasService.createCharge(
      new CreateAsaasChargeDto(chargeDto, customer.asaasId, subscription.price),
    );

    return await this.repository.save({ ...charge, asaasId: asaasCharge.id });
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

  async findChargeById(id: number, isRelation: boolean): Promise<ChargeEntity> {
    const relations = isRelation
      ? { customer: true, product: true }
      : undefined;
    const charge = await this.repository.findOne({ where: { id }, relations });

    if (!charge) {
      throw new NotFoundException(`Not found charge with this id: ${id}`);
    }

    return charge;
  }

  async findChargeByAsaasId(asaasId: string) {
    const charge = await this.repository.findOne({ where: { asaasId } });

    if (!charge) {
      throw new NotFoundException(
        `Not found charge with this asaasId: ${asaasId}`,
      );
    }

    return charge;
  }

  async updateByAsaasId(
    asaasId: string,
    chargeDto: UpdateChargeDto,
  ): Promise<ChargeEntity> {
    const charge = await this.findChargeByAsaasId(asaasId);

    return await this.repository.save({ ...charge, ...chargeDto });
  }

  async update(id: number, chargeDto: UpdateChargeDto): Promise<ChargeEntity> {
    const charge = await this.findChargeById(id, false);
    let { price } = charge;
    const { customerId, productId, discount } = chargeDto;

    if (customerId && customerId !== charge.customerId) {
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

  async deleteByAsaasId(asaasId: string) {
    const charge = await this.findChargeByAsaasId(asaasId);
    return await this.repository.remove(charge);
  }

  async delete(id: number): Promise<ChargeEntity> {
    const charge = await this.findChargeById(id, false);

    await this.asaasService.deleteCharge(charge.asaasId);

    return await this.repository.remove(charge);
  }
}
