import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { ChargeModule } from '../charge/charge.module';
import { AutentiqueModule } from '../autentique/autentique.module';
import { AutomationsModule } from '../automations/automations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    CustomerModule,
    ProductModule,
    forwardRef(() => AutomationsModule),
    ChargeModule,
    AutentiqueModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
