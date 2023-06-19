import { Module, forwardRef } from '@nestjs/common';
import { AutentiqueService } from './autentique.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ContractModule } from '../contract/contract.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ContractModule,
    forwardRef(() => SubscriptionModule),
  ],
  providers: [AutentiqueService],
  exports: [AutentiqueService],
})
export class AutentiqueModule {}
