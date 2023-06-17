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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
