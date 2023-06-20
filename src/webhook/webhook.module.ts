import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AutentiqueModule } from '../autentique/autentique.module';

@Module({
  imports: [SubscriptionModule, AutentiqueModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
