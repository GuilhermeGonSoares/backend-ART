import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'bool', default: true })
  active: boolean;

  @Column({ nullable: true, name: 'alocated_designer' })
  alocatedDesigner: string;

  @Column({ nullable: true, name: 'alocated_ads' })
  alocatedAds: string;

  @Column({ default: 0 })
  discount: number;

  @Column({ name: 'extra_costs', default: 0 })
  extraCosts: number;

  @Column({ name: 'preferred_due_date' })
  preferredDueDate: number;

  @Column({ name: 'initial_date' })
  initialDate: Date;

  @Column({ name: 'finished_date' })
  finishedDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //Relationship
  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'cnpj' })
  customer?: CustomerEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;
}
