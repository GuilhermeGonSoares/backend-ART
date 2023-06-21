import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { AsaasService } from '../asaas/asaas.service';
import { CreateAsaasClientDto } from '../asaas/dtos/create-client.dto';
import { UpdateAsaasClientDto } from '../asaas/dtos/update-client.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
    private readonly asaasService: AsaasService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const { cnpj, financeEmail } = createCustomerDto;

    const customers = await this.findCustomerByCnpjOREmail(cnpj, financeEmail);

    if (customers.length > 0) {
      throw new BadRequestException(
        'Already exist customer with cpnj or email',
      );
    }
    try {
      const customerAsaas = await this.asaasService.createClient(
        new CreateAsaasClientDto(createCustomerDto),
      );
      return await this.repository.save({
        ...createCustomerDto,
        asaasId: customerAsaas.id,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async list(): Promise<CustomerEntity[]> {
    return await this.repository.find();
  }

  async findCustomerBy<k extends keyof CustomerEntity>(
    key: k,
    value: CustomerEntity[k],
  ): Promise<CustomerEntity> {
    const customer = await this.repository.findOne({ where: { [key]: value } });

    if (!customer) {
      throw new NotFoundException(`Not found customer with ${[key]}: ${value}`);
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

  async update(
    cnpj: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = await this.findCustomerBy('cnpj', cnpj);
    const { financeEmail } = updateCustomerDto;

    if (financeEmail && financeEmail !== customer.financeEmail) {
      const customer = await this.findCustomerBy(
        'financeEmail',
        financeEmail,
      ).catch(() => undefined);

      if (customer) {
        throw new BadRequestException(
          `Already exist customer with this email: ${financeEmail}`,
        );
      }
    }
    await this.asaasService.updateClient(
      new UpdateAsaasClientDto(customer, updateCustomerDto),
    );
    return await this.repository.save({ ...customer, ...updateCustomerDto });
  }

  async delete(cnpj: string): Promise<CustomerEntity> {
    const customer = await this.findCustomerBy('cnpj', cnpj);
    await this.asaasService.deleteClient(customer.asaasId);

    return await this.repository.remove(customer);
  }
}
