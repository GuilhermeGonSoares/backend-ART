import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentType } from '../../enums/payment.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';

export class CreateChargeDto {
  @IsString()
  customerId: string;

  @IsInt()
  productId: number;

  @IsNumber()
  discount: number;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus: PaymentStatus;

  @IsDateString()
  paymentDate: string;
}
