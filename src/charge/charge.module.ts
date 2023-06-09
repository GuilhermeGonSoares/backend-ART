import { Module, forwardRef } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { ChargeEntity } from './entities/charge.entity';
import { AsaasModule } from '../asaas/asaas.module';
import { AutomationsModule } from '../automations/automations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChargeEntity]),
    CustomerModule,
    ProductModule,
    AsaasModule,
    forwardRef(() => AutomationsModule),
  ],
  controllers: [ChargeController],
  providers: [ChargeService],
  exports: [ChargeService],
})
export class ChargeModule {}
