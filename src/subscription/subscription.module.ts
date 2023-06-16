import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { AutentiqueModule } from '../autentique/autentique.module';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { CreateContractConsumer } from '../consumer/create-contract.consumer';
import { CreateDriveConsumer } from '../consumer/create-drive.consumer';
import { CreateGroupConsumer } from '../consumer/create-group.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('DB_REDIS_HOST'),
          port: configService.get('DB_REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'automations',
    }),
    CustomerModule,
    ProductModule,
    WhatsappModule,
    GoogleDriveModule,
    AutentiqueModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    CreateGroupConsumer,
    CreateContractConsumer,
    CreateDriveConsumer,
  ],
})
export class SubscriptionModule {}
