import { CustomerEntity } from '../../customer/entities/customer.entity';
import { ProductType } from '../../enums/product.enum';
import { ProductEntity } from '../../product/entities/product.entity';

export class CreateContractDto {
  name: string;
  filePath: string;
  customerName: string;
  customerCnpj: string;
  customerEmail: string;
  signatureDate?: string;
  contractTimeDays?: string;
  numberOfPosts?: string;
  finalPrice: string;
  type: ProductType;

  constructor(
    product: ProductEntity,
    customer: CustomerEntity,
    discount: number,
    type: ProductType,
  ) {
    this.name = product.contract.name;
    this.filePath = product.contract.filePath;
    this.customerName = customer.name;
    this.customerCnpj = customer.cnpj;
    this.customerEmail = customer.financeEmail;
    this.signatureDate = this.getCurrentDay();
    this.contractTimeDays = '30';
    this.numberOfPosts = product.numberOfPosts.toString();
    this.finalPrice = (product.price - discount).toString();
    this.type = type;
  }

  getCurrentDay() {
    const dataAtual = new Date(Date.now());
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
