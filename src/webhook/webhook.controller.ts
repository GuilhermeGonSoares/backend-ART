import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { SubscriptionService } from '../subscription/subscription.service';
import { AutentiqueService } from '../autentique/autentique.service';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly autentiqueService: AutentiqueService,
  ) {}
  @Post('contract')
  @HttpCode(200)
  handleContractSignedEvent(@Body() payload: any) {
    if (payload.partes[0].assinado) {
      const status = SubscriptionStatus.ACTIVE;
      const contractId = payload.documento.uuid;
      this.subscriptionService.updateSubscriptionStatusByAutentiqueId(
        contractId,
        status,
      );
      this.autentiqueService.updateSignatureStatus(
        contractId,
        AutentiqueStatus.SIGNED,
      );
    }
    console.log(payload);
    return;
  }
}
