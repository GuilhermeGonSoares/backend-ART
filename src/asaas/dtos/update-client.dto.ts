import { UpdateCustomerDto } from '../../customer/dtos/update-customer.dto';
import { CustomerEntity } from '../../customer/entities/customer.entity';

export class UpdateAsaasClientDto {
  private name: string;
  public asaasId: string;
  private cpfCnpj: string;
  private email: string;
  private phone: string;
  private mobilePhone: string;

  constructor(customer: CustomerEntity, updateCustomerDto: UpdateCustomerDto) {
    this.name = updateCustomerDto.name ? updateCustomerDto.name : customer.name;
    this.asaasId = customer.asaasId;
    this.cpfCnpj = updateCustomerDto.cnpj
      ? updateCustomerDto.cnpj
      : customer.cnpj;
    this.email = updateCustomerDto.financeEmail;
    this.phone = updateCustomerDto.financePhone;
    this.mobilePhone = updateCustomerDto.mainPhone;
  }
}
