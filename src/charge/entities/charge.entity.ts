import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentType } from '../../enums/payment.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { AutentiqueEntity } from '../../autentique/entities/autentique.entity';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';

@Entity({ name: 'charges' })
export class ChargeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'asaas_id', nullable: true })
  asaasId: string;

  @Column({ name: 'subscription_id', nullable: true })
  subscriptionId: number;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: {
      from: (value: string) => parseFloat(value), // Converte a string para número
      to: (value: number) => value.toFixed(2), // Converte o número de volta para string com 2 casas decimais
    },
  })
  price: number;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: {
      from: (value: string) => parseFloat(value), // Converte a string para número
      to: (value: number) => value.toFixed(2), // Converte o número de volta para string com 2 casas decimais
    },
    default: 0,
  })
  discount: number;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: {
      from: (value: string) => parseFloat(value), // Converte a string para número
      to: (value: number) => value.toFixed(2), // Converte o número de volta para string com 2 casas decimais
    },
    name: 'final_price',
  })
  finalPrice: number;

  @Column({ name: 'contract_id', nullable: true })
  contractId: number;

  @Column({ name: 'due_date', nullable: false })
  dueDate: Date;

  @Column({ name: 'payment_type', enum: PaymentType })
  paymentType: PaymentType;

  @Column({
    name: 'payment_status',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_date', nullable: true })
  paymentDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //Relationship
  @ManyToOne(() => CustomerEntity, (customer) => customer.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'cnpj' })
  customer?: CustomerEntity;

  @ManyToOne(() => ProductEntity, (product) => product.charges, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => AutentiqueEntity, (autentique) => autentique.subscription, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  contract?: AutentiqueEntity;

  @ManyToOne(() => SubscriptionEntity, (subscription) => subscription.charges)
  @JoinColumn({ name: 'subscription_id', referencedColumnName: 'id' })
  subscription?: SubscriptionEntity;

  public setChargeFromSubscription(
    subscription: SubscriptionEntity,
    dueDate: Date,
  ) {
    this.customerId = subscription.customerId;
    this.productId = subscription.productId;
    this.subscriptionId = subscription.id;
    this.price = subscription.price;
    this.discount = subscription.discount;
    this.finalPrice = subscription.price - subscription.discount;
    this.paymentType = subscription.paymentType;
    this.paymentStatus = PaymentStatus.PENDING;
    this.dueDate = dueDate;
    this.contractId = subscription.contractId;
  }
}
