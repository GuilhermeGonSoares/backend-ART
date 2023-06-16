import { CustomerEntity } from '../../customer/entities/customer.entity';

export class CreateGroupDto {
  customerName: string;
  phone: string;
  customerId: string;
  productName: string;
  links: string[];

  constructor(customer: CustomerEntity, productName: string, links: string[]) {
    this.customerName = customer.name;
    this.phone = customer.financePhone;
    this.customerId = customer.cnpj;
    this.productName = productName;
    this.links = links;
  }
}
