import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import {
  IsDateLaterThan,
  IsDateLaterThanToday,
} from '../../utils/validates/date.validation';
import { SubscriptionStatus } from '../../enums/subscription-status.enum';
import { PaymentType } from '../../enums/payment.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'customer_id',
    description: 'The ID of the customer',
  })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 1, description: 'The ID of the product' })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: SubscriptionStatus.PENDING,
    enum: SubscriptionStatus,
    description: 'The status of the subscription',
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status: SubscriptionStatus;

  @ApiProperty({
    example: 10.0,
    description: 'The discount for the subscription',
  })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({
    example: 'designer_id',
    description: 'The ID of the allocated designer',
  })
  @IsString()
  @IsOptional()
  alocatedDesigner: string;

  @ApiProperty({
    example: 'ads_id',
    description: 'The ID of the allocated ads',
  })
  @IsString()
  @IsOptional()
  alocatedAds: string;

  @ApiProperty({
    example: 5.0,
    description: 'Additional costs for the subscription',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  extraCosts: number;

  @ApiProperty({
    example: 10,
    description: 'The preferred due date for the subscription',
  })
  @IsInt()
  @Max(30)
  preferredDueDate: number;

  @ApiProperty({
    example: PaymentType.PIX,
    enum: PaymentType,
    description: 'The payment type for the subscription',
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({
    example: '2023-07-31',
    description: 'The initial date of the subscription',
  })
  @IsDateString()
  @Validate(IsDateLaterThanToday)
  initialDate: string;

  @ApiProperty({
    example: '2023-08-31',
    description: 'The finished date of the subscription',
  })
  @IsDateString()
  @Validate(IsDateLaterThan)
  finishedDate: string;
}
