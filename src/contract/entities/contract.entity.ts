import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'contracts' })
export class ContractEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'file_id' })
  fileId: string;

  //Relationship
  // 1 Contrato tem N inscrições diferentes ou N conbranças diferentes
  // 1 Contrato tem N diferentes produtos associados a ele.

  @OneToMany(() => ProductEntity, (product) => product.contract)
  products?: ProductEntity[];
}
