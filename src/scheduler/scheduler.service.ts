import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Cron } from '@nestjs/schedule';
import { ChargeService } from '../charge/charge.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { AutentiqueService } from '../autentique/autentique.service';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly chargeService: ChargeService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly autenteiqueService: AutentiqueService,
  ) {}
  private readonly logger = new Logger(SchedulerService.name);

  @Cron('* * * * *', {
    name: 'create-charge-for-subscription',
    timeZone: 'America/Sao_Paulo',
  })
  async scheduleChargeCreation() {
    this.logger.log('Searching for active subscriptions to generate billing');
    const preferredDueDate = new Date().getDate();
    const subscriptions =
      await this.subscriptionService.findActiveSubscriptionByPreferredDueDate(
        preferredDueDate,
      );
    await Promise.all(
      subscriptions.map(async (subscription) => {
        return await this.chargeService
          .createChargeForSubscription(subscription)
          .catch(() => undefined);
      }),
    );
  }

  @Cron('18 11 * * *', {
    name: 'find-contract-expired-rejected',
    timeZone: 'America/Sao_Paulo',
  })
  async handleSignatureAutentique() {
    const contracts =
      await this.autenteiqueService.findContractWithPendingSignature();

    for (const contract of contracts) {
      const document = await this.autenteiqueService.findDocument(
        contract.autentiqueId,
      );
      if (document.rejected !== null) {
        if (contract.type === 'subscription') {
          await this.subscriptionService.updateSubscriptionStatusByAutentiqueId(
            contract.autentiqueId,
            SubscriptionStatus.DISABLED,
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
