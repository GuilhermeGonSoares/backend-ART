import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '../../enums/product.enum';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { ChargeEntity } from '../../charge/entities/charge.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ enum: ProductType })
  type: ProductType;

  @Column({ name: 'number_of_posts', default: 0 })
  numberOfPosts: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //Relationship

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.product)
  subscriptions?: SubscriptionEntity[];

  @OneToMany(() => ChargeEntity, (charge) => charge.product)
  charges?: ChargeEntity[];
}
