import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { PaymentType } from '../../enums/payment.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { ChargeEntity } from '../entities/charge.entity';
import { IsDateLaterThanToday } from '../../utils/validates/date.validation';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChargeDto {
  @ApiProperty({
    example: 'customer_id',
    description: 'The ID of the customer',
  })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 123, description: 'The ID of the product' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 10, description: 'The discount amount' })
  @IsNumber()
  discount: number;

  @ApiProperty({ enum: PaymentType, description: 'The type of payment' })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ enum: PaymentStatus, description: 'The status of payment' })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus: PaymentStatus;

  @ApiProperty({
    example: '2023-07-31',
    description: 'The due date of payment',
  })
  @IsDateString()
  @Validate(IsDateLaterThanToday)
  dueDate: string;

  contractId?: number;

  asaasId?: string;

  public convertChargeToChargeDto(charge: ChargeEntity) {
    this.customerId = charge.customerId;
    this.productId = charge.productId;
    this.discount = charge.discount;
    this.paymentType = charge.paymentType;
    this.paymentStatus = charge.paymentStatus;
    this.dueDate = this.convertDateToDateString(charge.dueDate);
    this.contractId = charge.contractId ? charge.contractId : null;
  }

  private convertDateToDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de zero, então é necessário adicionar 1 ao valor retornado
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
