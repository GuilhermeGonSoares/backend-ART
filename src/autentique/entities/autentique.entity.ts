import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutentiqueStatus } from '../../enums/autentique-contract.enum';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { ChargeEntity } from '../../charge/entities/charge.entity';
import { ProductType } from '../../enums/product.enum';

@Entity({ name: 'autentique_contract' })
export class AutentiqueEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'autentique_id',
    type: 'varchar',
    nullable: true,
  })
  autentiqueId: string;

  @Column({
    name: 'signature_status',
    enum: AutentiqueStatus,
    default: AutentiqueStatus.PENDING,
  })
  signatureStatus: AutentiqueStatus;

  @Column()
  type: ProductType;

  //Relationship
  @OneToOne(() => SubscriptionEntity, (subscription) => subscription.contract)
  subscription?: SubscriptionEntity;

  @OneToMany(() => ChargeEntity, (charge) => charge.contract)
  charge?: ChargeEntity[];
}
