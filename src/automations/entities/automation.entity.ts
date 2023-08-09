import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType } from '../../enums/product.enum';

@Entity({ name: 'automations' })
export class AutomationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ enum: ProductType })
  type: ProductType;

  @Column({ name: 'service_id' })
  serviceId: number;

  @Column({ name: 'initial_date' })
  initialDate: Date;

  @Column()
  isCreateGroup: boolean;

  @Column()
  isCreateDrive: boolean;

  @Column()
  isAutentique: boolean;
}
