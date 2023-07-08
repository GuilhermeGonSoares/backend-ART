import { ApiProperty } from '@nestjs/swagger';
import { ReturnCustomerDto } from '../../customer/dtos/return-customer.dto';
import { SubscriptionStatus } from '../../enums/subscription-status.enum';
import { ReturnProductDto } from '../../product/dtos/return-product.dto';
import { SubscriptionEntity } from '../entities/subscription.entity';

export class ReturnSubscriptionDto {
  @ApiProperty({ example: 1, description: 'The ID of the subscription' })
  id: number;

  @ApiProperty({
    example: 'customer_id',
    description: 'The ID of the customer',
  })
  customerId: string;

  @ApiProperty({ example: 1, description: 'The ID of the product' })
  productId: number;

  @ApiProperty({
    example: SubscriptionStatus.PENDING,
    enum: SubscriptionStatus,
    description: 'The status of the subscription',
  })
  status: SubscriptionStatus;

  @ApiProperty({
    example: 'designer_id',
    description: 'The ID of the allocated designer',
  })
  alocatedDesigner: string;

  @ApiProperty({
    example: 'ads_id',
    description: 'The ID of the allocated ads',
  })
  alocatedAds: string;

  @ApiProperty({ example: 9.99, description: 'The price of the subscription' })
  price: number;

  @ApiProperty({
    example: 2.5,
    description: 'The discount for the subscription',
  })
  discount: number;

  @ApiProperty({
    example: 1.5,
    description: 'Additional costs for the subscription',
  })
  extraCosts: number;

  @ApiProperty({
    example: 15,
    description: 'The preferred due date for the subscription',
  })
  preferredDueDate: number;

  @ApiProperty({
    example: '2023-07-01T00:00:00Z',
    description: 'The initial date of the subscription',
  })
  initialDate: Date;

  @ApiProperty({
    example: '2023-08-01T00:00:00Z',
    description: 'The finished date of the subscription',
  })
  finishedDate: Date;

  @ApiProperty({
    type: ReturnCustomerDto,
    description: 'The customer associated with the subscription',
  })
  customer?: ReturnCustomerDto;

  @ApiProperty({
    type: ReturnProductDto,
    description: 'The product associated with the subscription',
  })
  product?: ReturnProductDto;

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
