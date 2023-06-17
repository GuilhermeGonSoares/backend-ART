import { Module } from '@nestjs/common';
import { CreateContractConsumer } from './create-contract.consumer';
import { CreateDriveConsumer } from './create-drive.consumer';
import { CreateGroupConsumer } from './create-group.consumer';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { AutentiqueModule } from '../autentique/autentique.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

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
    WhatsappModule,
    GoogleDriveModule,
    AutentiqueModule,
  ],
  providers: [CreateDriveConsumer, CreateGroupConsumer, CreateContractConsumer],
  exports: [
    CreateDriveConsumer,
    CreateGroupConsumer,
    CreateContractConsumer,
    BullModule.registerQueue(),
  ],
})
export class AutomationsModule {}
