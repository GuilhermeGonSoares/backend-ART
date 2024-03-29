import { Module, forwardRef } from '@nestjs/common';
import { CreateContractConsumer } from './create-contract.consumer';
import { CreateDriveConsumer } from './create-drive.consumer';
import { CreateGroupConsumer } from './create-group.consumer';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { AutentiqueModule } from '../autentique/autentique.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { AutomationsController } from './automations.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AsaasModule } from '../asaas/asaas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationEntity } from './entities/automation.entity';
import { ChargeModule } from '../charge/charge.module';
import { AutomationsService } from './automations.service';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([AutomationEntity]),
    WhatsappModule,
    GoogleDriveModule,
    AsaasModule,
    forwardRef(() => ChargeModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => AutentiqueModule),
  ],
  providers: [
    AutomationsService,
    CreateDriveConsumer,
    CreateGroupConsumer,
    CreateContractConsumer,
  ],
  exports: [
    AutomationsService,
    CreateDriveConsumer,
    CreateGroupConsumer,
    CreateContractConsumer,
    BullModule.registerQueue(),
  ],
  controllers: [AutomationsController],
})
export class AutomationsModule {}
