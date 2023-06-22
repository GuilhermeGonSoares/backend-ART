import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentType } from '../../enums/payment.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { ChargeEntity } from '../entities/charge.entity';

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

  @IsBoolean()
  isAutentique?: boolean;

  contractId?: number;

  asaasId?: string;

  public convertChargeToChargeDto(charge: ChargeEntity) {
    this.customerId = charge.customerId;
    this.productId = charge.productId;
    this.discount = charge.discount;
    this.paymentType = charge.paymentType;
    this.paymentStatus = charge.paymentStatus;
    this.paymentDate = this.convertDateToDateString(charge.paymentDate);
  }

  private convertDateToDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de zero, então é necessário adicionar 1 ao valor retornado
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
