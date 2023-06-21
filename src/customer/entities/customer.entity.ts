import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { ChargeEntity } from '../../charge/entities/charge.entity';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @PrimaryColumn({ type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column()
  name: string;

  @Column({ name: 'asaas_id' })
  asaasId: string;

  @Column()
  city: string;

  @Column({ type: 'char', length: 2 })
  uf: string;

  @Column({ name: 'main_phone', type: 'varchar', length: 12 })
  mainPhone: string;

  @Column({ name: 'finance_phone', type: 'varchar', length: 12 })
  financePhone: string;

  @Column({ name: 'finance_email', unique: true })
  financeEmail: string;

  @Column({ name: 'instagram_profile' })
  instagramProfile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //Relationship

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.customer)
  subscriptions?: SubscriptionEntity[];

  @OneToMany(() => ChargeEntity, (charge) => charge.customer)
  charges?: ChargeEntity[];
}
