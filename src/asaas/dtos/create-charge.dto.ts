import { PaymentType } from '../../enums/payment.enum';
import { CreateChargeDto } from '../../charge/dto/create-charge.dto';

type Discount = {
  value: number;
  dueDateLimitDays: number;
  type: 'FIXED';
};

export class CreateAsaasChargeDto {
  customer: string;
  billingType: PaymentType;
  value: number;
  dueDate: string;
  discount: Discount;

  constructor(
    chargeDto: CreateChargeDto,
    asaasCustomerId: string,
    value: number,
  ) {
    this.customer = asaasCustomerId;
    this.billingType = chargeDto.paymentType;
    this.value = chargeDto.discount ? value - chargeDto.discount : value;
    this.dueDate = chargeDto.dueDate;
    this.discount = {
      value: 0,
      type: 'FIXED',
      dueDateLimitDays: 0,
    };
  }
}
