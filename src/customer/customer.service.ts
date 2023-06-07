import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const { cnpj, financeEmail } = createCustomerDto;
    const customers = await this.findCustomerByCnpjOREmail(cnpj, financeEmail);

    if (customers.length > 0) {
      throw new BadRequestException(
        'Already exist customer with cpnj or email',
      );
    }

    return await this.repository.save({ ...createCustomerDto });
  }

  async list(): Promise<CustomerEntity[]> {
    return await this.repository.find();
  }

  async findCustomerByCnpj(cnpj: string): Promise<CustomerEntity> {
    const customer = await this.repository.findOne({ where: { cnpj } });

    if (!customer) {
      throw new NotFoundException(`Not found customer with cnpj: ${cnpj}`);
    }

    return customer;
  }

  async findCustomerByCnpjOREmail(
    cnpj: string,
    email: string,
  ): Promise<CustomerEntity[]> {
    return await this.repository
      .createQueryBuilder('customers')
      .where('customers.cnpj = :cnpj OR customers.finance_email = :email', {
        cnpj,
        email,
      })
      .getMany();
  }
}
