import { CustomerEntity } from '../entities/customer.entity';

export class ReturnCustomerDto {
  private cnpj: string;
  private name: string;
  private city: string;
  private uf: string;
  private mainPhone: string;
  private financePhone: string;
  private financeEmail: string;
  private instagramProfile: string;

  constructor(customer: CustomerEntity) {
    this.cnpj = customer.cnpj;
    this.name = customer.name;
    this.city = customer.city;
    this.uf = customer.uf;
    this.mainPhone = customer.mainPhone;
    this.financePhone = customer.financePhone;
    this.financeEmail = customer.financeEmail;
    this.instagramProfile = customer.instagramProfile;
  }
}
