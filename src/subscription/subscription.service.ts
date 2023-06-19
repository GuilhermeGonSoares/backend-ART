import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { Repository, In, IsNull } from 'typeorm';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { ProductType } from '../enums/product.enum';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateContractDto } from '../automations/dtos/create-contract.dto';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly repository: Repository<SubscriptionEntity>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}

  async create(
    subscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const {
      customerId,
      productId,
      isCreateGroup,
      isCreateDrive,
      isAutentique,
    } = subscriptionDto;

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

    const subscriptionCreated = await this.repository.save({
      ...subscriptionDto,
      price: product.price,
    });

    if (isCreateDrive) {
      await this.automationQueue.add(
        'createDrive',
        {
          customer,
          productName: product.name,
          isCreateGroup,
        },
        {
          priority: 1,
        },
      );
    }

    // if (isCreateGroup) {
    //   const createGroupDto = new CreateGroupDto(customer, product.name, [
    //     linkDrive,
    //   ]);
    //   await this.automationQueue.add('createGroup', {
    //     ...createGroupDto,
    //   });
    // }

    if (isAutentique) {
      const discount = subscriptionDto.discount;
      const payload = new CreateContractDto(product, customer, discount);
      await this.automationQueue.add('autentique', {
        ...payload,
      });
    }

    return subscriptionCreated;
  }

  async list(): Promise<SubscriptionEntity[]> {
    return await this.repository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });
  }

  async updateSubscriptionStatusByContractId(
    contractId: string,
    status: SubscriptionStatus,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.repository.findOne({
      where: { contractId },
    });
    if (!subscription) {
      throw new NotFoundException(
        `Not Found subscription with this contractId`,
      );
    }
    return this.repository.save({ ...subscription, status });
  }

  async updateSubscriptionWithNullContractId(
    customerId: string,
    contractId: string,
  ): Promise<SubscriptionEntity> {
    console.log('customerId', customerId);
    console.log('contractId', contractId);

    const subscription = await this.repository.findOne({
      where: {
        customerId,
        status: SubscriptionStatus.PENDING,
        contractId: IsNull(),
      },
    });
    console.log(subscription);
    if (!subscription) {
      throw new NotFoundException(
        `Not Found subscription for this customerId with contract_id null`,
      );
    }

    return this.repository.save({ ...subscription, contractId });
  }

  async findActiveSubscriptionByCustomerId(
    customerId: string,
    isRelation: boolean,
  ): Promise<SubscriptionEntity> {
    const relations = isRelation
      ? { customer: true, product: true }
      : undefined;
    const subscription = await this.repository.findOne({
      where: {
        customerId,
        status: In([SubscriptionStatus.PENDING, SubscriptionStatus.ACTIVE]),
      },
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
    subscription.status = SubscriptionStatus.DISABLED;
    return await this.repository.save({ ...subscription });
  }
}
