import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/database';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ChargeModule } from './charge/charge.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { AutentiqueModule } from './autentique/autentique.module';
import { ContractModule } from './contract/contract.module';
import { AutomationsModule } from './automations/automations.module';
import { WebhookModule } from './webhook/webhook.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AsaasModule } from './asaas/asaas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ScheduleModule.forRoot(),
    CustomerModule,
    ProductModule,
    SubscriptionModule,
    ChargeModule,
    WhatsappModule,
    GoogleDriveModule,
    AutentiqueModule,
    ContractModule,
    AutomationsModule,
    WebhookModule,
    SchedulerModule,
    AsaasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
