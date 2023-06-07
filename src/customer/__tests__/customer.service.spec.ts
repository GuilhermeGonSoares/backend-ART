import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../customer.service';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<CustomerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: {},
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
});
