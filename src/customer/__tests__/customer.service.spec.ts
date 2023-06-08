import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../customer.service';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerMock } from '../__mocks__/customer.mock';
import { CreateCustomerMock } from '../__mocks__/create-customer.mock';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<CustomerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([CustomerMock]),
            })),
            find: jest.fn().mockReturnValue([CustomerMock]),
            findOne: jest.fn().mockReturnValue(CustomerMock),
            save: jest.fn().mockReturnValue(CustomerMock),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<CustomerEntity>>(
      getRepositoryToken(CustomerEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return all customers', async () => {
    const customers = await service.list();

    expect(customers).toEqual([CustomerMock]);
  });

  it('should return a list of customers with CNPJ or email', async () => {
    const customers = await service.findCustomerByCnpjOREmail(
      CustomerMock.cnpj,
      CustomerMock.financeEmail,
    );

    expect(customers).toEqual([CustomerMock]);
  });

  it('should return customer by cnpj', async () => {
    const customer = await service.findCustomerByCnpj(CustomerMock.cnpj);

    expect(customer).toEqual(CustomerMock);
  });

  it('should return error with not exist customer with cnpj', async () => {
    jest.spyOn(repository, 'findOne').mockReturnValue(undefined);
    expect(
      service.findCustomerByCnpj(CustomerMock.cnpj),
    ).rejects.toThrowError();
  });

  it('should create customer', async () => {
    jest.spyOn(service, 'findCustomerByCnpjOREmail').mockResolvedValue([]);
    const customer = await service.create(CreateCustomerMock);

    expect(customer).toEqual(CustomerMock);
  });

  it('should return error with already exist customer with cnpj or email', async () => {
    expect(service.create(CreateCustomerMock)).rejects.toThrowError();
  });
});
