import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Cron } from '@nestjs/schedule';
import { ChargeService } from '../charge/charge.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { AutentiqueService } from '../autentique/autentique.service';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';
import { ProductType } from '../enums/product.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { AutomationsService } from '../automations/automations.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly chargeService: ChargeService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly autenteiqueService: AutentiqueService,
    private readonly automationService: AutomationsService,
  ) {}
  private readonly logger = new Logger(SchedulerService.name);

  @Cron('0 0 8 * * *', {
    name: 'trigger-automation',
    timeZone: 'America/Sao_Paulo',
  })
  async scheduleAutomation() {
    const currentUTCDate = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    );
    currentUTCDate.setUTCHours(0, 0, 0, 0);
    this.logger.log(
      `Searching for automation for ${String(
        currentUTCDate.getUTCDate(),
      ).padStart(2, '0')}/${String(currentUTCDate.getMonth()).padStart(
        2,
        '0',
      )}/${currentUTCDate.getFullYear()}`,
    );

    const automations =
      await this.automationService.findAutomationByInitialDate(currentUTCDate);

    automations.map(async (automation) => {
      await this.automationService.createAutomations({
        id: automation.serviceId,
        type: automation.type,
        isAutentique: automation.isAutentique,
        isCreateDrive: automation.isCreateDrive,
        isCreateGroup: automation.isCreateGroup,
      });
      await this.automationService.delete(automation.id);
    });
  }

  @Cron('15 * * * *', {
    name: 'create-charge-for-subscription',
    timeZone: 'America/Sao_Paulo',
  })
  async scheduleChargeCreation() {
    this.logger.log('Searching for active subscriptions to generate billing');
    const preferredDueDate = new Date().getUTCDate();
    const subscriptions =
      await this.subscriptionService.findActiveSubscriptionByPreferredDueDate(
        preferredDueDate,
      );

    const subscriptionsId = [];
    subscriptions.forEach((subscription) =>
      subscriptionsId.push(subscription.id),
    );

    if (subscriptions.length > 0) {
      this.logger.log(
        `Gerando cobranças para as seguintes inscrições ativas: ${subscriptionsId}`,
      );
    }

    await Promise.all(
      subscriptions.map(async (subscription) => {
        return await this.chargeService.createChargeForSubscription(
          subscription,
        );
      }),
    );
  }

  @Cron('0 10 * * *', {
    name: 'find-contract-expired-rejected',
    timeZone: 'America/Sao_Paulo',
  })
  async handleSignatureAutentique() {
    this.logger.log('Searching for contract rejected');
    const contracts =
      await this.autenteiqueService.findContractWithPendingSignature();
    for (const contract of contracts) {
      const document = await this.autenteiqueService.findDocument(
        contract.autentiqueId,
      );
      if (document && document.rejected !== null) {
        if (contract.type === ProductType.Subscription) {
          await this.subscriptionService.updateSubscriptionStatusByAutentiqueId(
            contract.autentiqueId,
            SubscriptionStatus.DISABLED,
          );
        } else if (contract.type === ProductType.Unique) {
          await this.chargeService.updateChargeStatusByAutentiqueId(
            contract.autentiqueId,
            PaymentStatus.REJECTED,
          );
        }
        await this.autenteiqueService.updateSignatureStatus(
          contract.autentiqueId,
          AutentiqueStatus.REJECTED,
        );
      }
    }
  }
}
