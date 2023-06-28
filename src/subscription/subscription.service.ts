import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { Repository, In } from 'typeorm';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { ProductType } from '../enums/product.enum';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { AutentiqueService } from '../autentique/autentique.service';
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly repository: Repository<SubscriptionEntity>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly autentiqueService: AutentiqueService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}

  async create(
    subscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const { customerId, productId } = subscriptionDto;

    const [, product] = await Promise.all([
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
    const contract = await this.autentiqueService.createContractInDatabase(
      ProductType.Subscription,
    );

    const subscriptionCreated = await this.repository.save({
      contractId: contract.id,
      ...subscriptionDto,
      price: product.price,
    });

    return subscriptionCreated;
  }

  async list(): Promise<SubscriptionEntity[]> {
    return await this.repository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });
  }

  async updateSubscriptionStatusByAutentiqueId(
    autentiqueId: string,
    status: SubscriptionStatus,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.repository.findOne({
      where: { contract: { autentiqueId } },
    });
    if (!subscription) {
      throw new NotFoundException(
        `Not Found subscription with this autentiqueId`,
      );
    }
    return this.repository.save({ ...subscription, status });
  }

  async findPendingSubscriptionByCustomerId(
    customerId: string,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.repository.findOne({
      where: {
        status: SubscriptionStatus.PENDING,
        customerId,
      },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Not found pending subscription for this cnpj: ${customerId}`,
      );
    }

    return subscription;
  }
  async findOneSubscriptionById(
    id: number,
    isRelation: boolean,
  ): Promise<SubscriptionEntity> {
    const relations = isRelation
      ? { customer: true, product: true }
      : undefined;
    const subscription = await this.repository.findOne({
      where: {
        id,
        status: In([SubscriptionStatus.PENDING, SubscriptionStatus.ACTIVE]),
      },
      relations,
    });

    if (!subscription) {
      throw new NotFoundException(
        `Not found subscription active for this id: ${id}`,
      );
    }

    return subscription;
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

  async findActiveSubscriptionByPreferredDueDate(
    preferredDueDate: number,
  ): Promise<SubscriptionEntity[]> {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();

    const subscriptions = await this.repository
      .createQueryBuilder('s')
      .leftJoin(
        's.charges',
        'c',
        'EXTRACT(MONTH FROM c.createdAt) = :currentMonth AND EXTRACT(YEAR FROM c.createdAt) = :currentYear',
        { currentMonth, currentYear },
      )
      .where('c.subscription IS NULL')
      .andWhere('s.status = :status', { status: SubscriptionStatus.ACTIVE })
      .andWhere('s.preferredDueDate BETWEEN :startDate AND :endDate', {
        startDate: preferredDueDate,
        endDate: preferredDueDate + 7,
      })
      .getMany();
    return subscriptions;
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
