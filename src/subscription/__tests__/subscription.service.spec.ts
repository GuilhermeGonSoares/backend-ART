import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../subscription.service';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SubscriptionService', () => {
  let serviceSubscription: SubscriptionService;
  let repository: Repository<SubscriptionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(SubscriptionEntity),
          useValue: {},
        },
      ],
    }).compile();

    serviceSubscription = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<Repository<SubscriptionEntity>>(
      getRepositoryToken(SubscriptionEntity),
    );
  });

  it('should be defined', () => {
    expect(serviceSubscription).toBeDefined();
  });
});
