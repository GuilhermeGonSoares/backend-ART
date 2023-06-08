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

  @Column({ type: 'bool' })
  active: boolean;

  @Column()
  discount: number;

  @Column({ name: 'extra_costs' })
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
