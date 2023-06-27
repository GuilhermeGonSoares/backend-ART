import { Injectable } from '@nestjs/common';
import { ProductType } from '../enums/product.enum';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateAutomationDto } from './dtos/create-automation.dto';
import { AutentiqueService } from '../autentique/autentique.service';
import { ProductEntity } from '../product/entities/product.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { CreateGroupDto } from './dtos/create-group.dto';

type AutomationDto = {
  product: ProductEntity;
  customer: CustomerEntity;
  discount: number;
  type: ProductType;
  contractId: number;
};
@Injectable()
export class AutomationsService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly autentiqueService: AutentiqueService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}

  async createAutomations(automationDto: CreateAutomationDto) {
    const { type, customerId } = automationDto;

    let entity: AutomationDto;
    if (type === ProductType.Subscription) {
      const subscription =
        await this.subscriptionService.findActiveSubscriptionByCustomerId(
          customerId,
          true,
        );
      entity = {
        customer: subscription.customer,
        product: subscription.product,
        discount: subscription.discount,
        contractId: subscription.contractId,
        type,
      };
    }

    if (automationDto.isAutentique && entity.contractId) {
      await this.createAutentique(entity);
    }

    if (automationDto.isCreateDrive) {
      await this.createGoogleDrive(entity);
    }

    if (automationDto.isCreateGroup && !automationDto.isCreateDrive) {
      this.createGroupWhatsapp(entity);
    }
  }
  async createAutentique(entity: AutomationDto) {
    const payload = new CreateContractDto(
      entity.product,
      entity.customer,
      entity.discount,
      entity.type,
    );
    await this.autentiqueService.updateForNullAutentiqueId(entity.contractId);
    await this.automationQueue.add('autentique', {
      ...payload,
    });
  }

  async createGoogleDrive(entity: AutomationDto, isCreateGroup = true) {
    await this.automationQueue.add(
      'createDrive',
      {
        customer: entity.customer,
        productName: entity.product.name,
        isCreateGroup,
      },
      {
        priority: 1,
      },
    );
  }

  async createGroupWhatsapp(entity: AutomationDto) {
    const createGroupDto = new CreateGroupDto(
      entity.customer,
      entity.product.name,
      [],
    );
    await this.automationQueue.add(
      'createGroup',
      {
        ...createGroupDto,
      },
      { lifo: true },
    );
  }
}
