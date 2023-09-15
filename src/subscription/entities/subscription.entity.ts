import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { SubscriptionStatus } from '../../enums/subscription-status.enum';
import { AutentiqueEntity } from '../../autentique/entities/autentique.entity';
import { ChargeEntity } from '../../charge/entities/charge.entity';
import { PaymentType } from '../../enums/payment.enum';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Column({ nullable: true, name: 'alocated_designer' })
  alocatedDesigner: string;

  @Column({ nullable: true, name: 'alocated_ads' })
  alocatedAds: string;

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
    default: 0,
    name: 'extra_costs',
  })
  extraCosts: number;

  @Column({ name: 'preferred_due_date' })
  preferredDueDate: number;

  @Column({
    name: 'payment_type',
    enum: PaymentType,
    default: PaymentType.BOLETO,
  })
  paymentType: PaymentType;

  @Column({ name: 'contract_id', nullable: true })
  contractId: number;

  @Column({ name: 'initial_date' })
  initialDate: Date;

  @Column({ name: 'finished_date' })
  finishedDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //Relationship
  @ManyToOne(() => CustomerEntity, (customer) => customer.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'cnpj' })
  customer?: CustomerEntity;

  @ManyToOne(() => ProductEntity, (product) => product.subscriptions)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @OneToOne(() => AutentiqueEntity, (autentique) => autentique.subscription, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  contract?: AutentiqueEntity;

  @OneToMany(() => ChargeEntity, (charge) => charge.subscription)
  charges?: ChargeEntity;
}
