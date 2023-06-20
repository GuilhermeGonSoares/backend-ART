import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ChargeModule } from '../charge/charge.module';
import { AutentiqueModule } from '../autentique/autentique.module';

@Module({
  imports: [SubscriptionModule, ChargeModule, AutentiqueModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
