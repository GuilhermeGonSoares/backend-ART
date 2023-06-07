import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @PrimaryColumn({ type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column()
  name: string;

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
}
