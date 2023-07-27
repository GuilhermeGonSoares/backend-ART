import { PaymentStatus } from '../../enums/payment-status.enum';
import { PaymentType } from '../../enums/payment.enum';
import { ReturnProductDto } from '../../product/dtos/return-product.dto';
import { ChargeEntity } from '../entities/charge.entity';

export class ReturnChargeDto {
  private id: number;
  private customerId: string;
  private productId: number;
  private customerName: string;
  private productName: string;
  private price: number;
  private discount: number;
  private finalPrice: number;
  private paymentType: PaymentType;
  private paymentStatus: PaymentStatus;
  private dueDate: Date;
  private product?: ReturnProductDto;

  constructor(charge: ChargeEntity) {
    this.id = charge.id;
    this.customerId = charge.customerId;
    this.productId = charge.product ? charge.productId : undefined;
    this.customerName = charge.customer.name;
    this.productName = charge.product.name;
    this.price = charge.price;
    this.discount = charge.discount;
    this.finalPrice = charge.finalPrice;
    this.paymentType = charge.paymentType;
    this.paymentStatus = charge.paymentStatus;
    this.dueDate = charge.dueDate;
    // this.product = charge.product
    //   ? new ReturnProductDto(charge.product)
    //   : undefined;
  }
}
