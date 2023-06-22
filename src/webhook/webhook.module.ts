import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AutentiqueModule } from '../autentique/autentique.module';
import { ChargeModule } from '../charge/charge.module';
import { CustomerModule } from '../customer/customer.module';
import { AsaasModule } from '../asaas/asaas.module';

@Module({
  imports: [
    SubscriptionModule,
    AutentiqueModule,
    ChargeModule,
    CustomerModule,
    AsaasModule,
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}
