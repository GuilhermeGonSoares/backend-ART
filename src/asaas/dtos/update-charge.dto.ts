import { UpdateChargeDto } from '../../charge/dto/update-charge.dto';
import { ChargeEntity } from '../../charge/entities/charge.entity';
import { PaymentType } from '../../enums/payment.enum';

export class UpdateAsaasChargeDto {
  private billingType: PaymentType;
  private value: number;
  private dueDate: string;

  constructor(charge: ChargeEntity, updateChargeDto: UpdateChargeDto) {
    this.billingType = updateChargeDto.paymentType ?? charge.paymentType;
    this.value = updateChargeDto.discount
      ? charge.price - updateChargeDto.discount
      : null;
    this.dueDate = updateChargeDto.dueDate ?? null;
  }
}
