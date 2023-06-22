import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column()
  price: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ name: 'final_price' })
  finalPrice: number;

  @Column({ name: 'contract_id', nullable: true })
  contractId: number;

  @Column({ name: 'payment_type', enum: PaymentType })
  paymentType: PaymentType;

  @Column({
    name: 'payment_status',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_date', nullable: false })
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

  @OneToOne(() => AutentiqueEntity, (autentique) => autentique.subscription, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  contract?: AutentiqueEntity;

  @ManyToOne(() => SubscriptionEntity)
  @JoinColumn({ name: 'subscription_id', referencedColumnName: 'id' })
  subscriptions?: SubscriptionEntity;
}
