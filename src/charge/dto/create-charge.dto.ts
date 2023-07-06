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
