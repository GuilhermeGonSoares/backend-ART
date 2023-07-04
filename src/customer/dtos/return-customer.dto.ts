import { ApiProperty } from '@nestjs/swagger';
import { CustomerEntity } from '../entities/customer.entity';

export class ReturnCustomerDto {
  @ApiProperty()
  private cnpj: string;

  @ApiProperty()
  private name: string;

  @ApiProperty()
  private asaasId: string;

  @ApiProperty()
  private city: string;

  @ApiProperty()
  private uf: string;

  @ApiProperty()
  private mainPhone: string;

  @ApiProperty()
  private financePhone: string;

  @ApiProperty()
  private financeEmail: string;

  @ApiProperty()
  private instagramProfile: string;

  constructor(customer: CustomerEntity) {
    this.cnpj = customer.cnpj;
    this.name = customer.name;
    this.asaasId = customer.asaasId;
    this.city = customer.city;
    this.uf = customer.uf;
    this.mainPhone = customer.mainPhone;
    this.financePhone = customer.financePhone;
    this.financeEmail = customer.financeEmail;
    this.instagramProfile = customer.instagramProfile;
  }
}
