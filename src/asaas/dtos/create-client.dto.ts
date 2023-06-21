import { CreateCustomerDto } from '../../customer/dtos/create-customer.dto';

export class CreateAsaasClientDto {
  private name: string;
  private cpfCnpj: string;
  private email: string;
  private phone: string;
  private mobilePhone: string;

  constructor(createCustomer: CreateCustomerDto) {
    this.name = createCustomer.name;
    this.cpfCnpj = createCustomer.cnpj;
    this.email = createCustomer.financeEmail;
    this.phone = createCustomer.financePhone;
    this.mobilePhone = createCustomer.mainPhone;
  }
}
