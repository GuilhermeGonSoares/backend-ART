import { ReturnCustomerDto } from '../../customer/dtos/return-customer.dto';
import { SubscriptionStatus } from '../../enums/subscription-status.enum';
import { ReturnProductDto } from '../../product/dtos/return-product.dto';
import { SubscriptionEntity } from '../entities/subscription.entity';

export class ReturnSubscriptionDto {
  private id: number;
  private customerId: string;
  private productId: number;
  private status: SubscriptionStatus;
  private alocatedDesigner: string;
  private alocatedAds: string;
  private price: number;
  private discount: number;
  private extraCosts: number;
  private preferredDueDate: number;
  private initialDate: Date;
  private finishedDate: Date;
  private customer?: ReturnCustomerDto;
  private product?: ReturnProductDto;

  constructor(subscription: SubscriptionEntity) {
    this.id = subscription.id;
    this.customerId = subscription.customer
      ? undefined
      : subscription.customerId;
    this.productId = subscription.product ? undefined : subscription.productId;
    this.status = subscription.status;
    this.alocatedDesigner = subscription.alocatedDesigner;
    this.alocatedAds = subscription.alocatedAds;
    this.price = subscription.price;
    this.discount = subscription.discount;
    this.extraCosts = subscription.extraCosts;
    this.preferredDueDate = subscription.preferredDueDate;
    this.initialDate = subscription.initialDate;
    this.finishedDate = subscription.finishedDate;
    this.customer = subscription.customer
      ? new ReturnCustomerDto(subscription.customer)
      : undefined;
    this.product = subscription.product
      ? new ReturnProductDto(subscription.product)
      : undefined;
  }
}
