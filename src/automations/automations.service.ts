import { Injectable } from '@nestjs/common';
import { ProductType } from '../enums/product.enum';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateAutomationDto } from './dtos/create-automation.dto';
import { AutentiqueService } from '../autentique/autentique.service';

@Injectable()
export class AutomationsService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly autentiqueService: AutentiqueService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}

  async createAutomations(automationDto: CreateAutomationDto) {
    if (automationDto.isAutentique) {
      await this.createAutentique(automationDto.type, automationDto.foreignKey);
    }
  }
  async createAutentique(type: ProductType, customerId: string) {
    if (type === ProductType.Subscription) {
      const subscription =
        await this.subscriptionService.findActiveSubscriptionByCustomerId(
          customerId,
          true,
        );

      const payload = new CreateContractDto(
        subscription.product,
        subscription.customer,
        subscription.discount,
        ProductType.Subscription,
      );
      await this.autentiqueService.updateForNullAutentiqueId(
        subscription.contractId,
      );
      await this.automationQueue.add('autentique', {
        ...payload,
      });
    }
  }
}
