import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { ProductType } from '../enums/product.enum';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly repository: Repository<SubscriptionEntity>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly whatsappService: WhatsappService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async create(
    subscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const { customerId, productId, isCreateGroup, isCreateDrive } =
      subscriptionDto;

    const [customer, product] = await Promise.all([
      this.customerService.findCustomerBy('cnpj', customerId),
      this.productService.findProductBy('id', productId),
    ]);

    if (product.type === ProductType.Unique) {
      throw new BadRequestException(
        `This productId ${productId} is not a subscription type product`,
      );
    }

    const subscription = await this.findActiveSubscriptionByCustomerId(
      customerId,
      false,
    ).catch(() => undefined);

    if (subscription) {
      throw new BadRequestException(
        `Already exist subscription for this customerId: ${customerId}`,
      );
    }

    let linkDrive: string;

    if (isCreateDrive) {
      linkDrive = await this.googleDriveService.createFolder(
        customer.name,
        customer.cnpj,
      );
    }

    if (isCreateGroup) {
      await this.whatsappService.createGroup(
        customer.financePhone,
        customer.name,
        customer.cnpj,
        product.name,
        [linkDrive],
      );
    }

    return await this.repository.save({
      ...subscriptionDto,
      price: product.price,
    });
  }

  async list(): Promise<SubscriptionEntity[]> {
    return await this.repository.find({ where: { active: true } });
  }

  async findActiveSubscriptionByCustomerId(
    customerId: string,
    isRelation: boolean,
  ): Promise<SubscriptionEntity> {
    const relations = isRelation
      ? { customer: true, product: true }
      : undefined;
    const subscription = await this.repository.findOne({
      where: { customerId, active: true },
      relations,
    });

    if (!subscription) {
      throw new NotFoundException(
        `Not found subscription active for this customerID: ${customerId}`,
      );
    }

    return subscription;
  }

  async updateSubscription(
    customerId: string,
    subscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const { customerId: newCustomerId, productId } = subscriptionDto;
    const subscription = await this.findActiveSubscriptionByCustomerId(
      customerId,
      false,
    );

    if (newCustomerId && newCustomerId !== customerId) {
      const [, subscription] = await Promise.all([
        this.customerService.findCustomerBy('cnpj', newCustomerId),
        this.findActiveSubscriptionByCustomerId(newCustomerId, false).catch(
          () => undefined,
        ),
      ]);
      if (subscription) {
        throw new BadRequestException(
          `This customer id: ${newCustomerId} already has an active subscription`,
        );
      }
    }

    if (productId && productId !== subscription.productId) {
      const product = await this.productService.findProductBy('id', productId);
      if (product.type !== ProductType.Subscription) {
        throw new BadRequestException(`Product must be inscription type`);
      }
    }

    return await this.repository.save({ ...subscription, ...subscriptionDto });
  }

  async deleteActiveSubscription(
    customerId: string,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findActiveSubscriptionByCustomerId(
      customerId,
      false,
    );
    subscription.active = false;
    return await this.repository.save({ ...subscription });
  }
}
