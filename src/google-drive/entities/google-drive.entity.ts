import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customer/entities/customer.entity';

@Entity({ name: 'google_drive' })
export class GoogleDriveEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ unique: true })
  folderId: string;

  @Column()
  link: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationship
  @OneToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'cnpj' })
  customer: CustomerEntity;
}
