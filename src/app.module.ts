import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/database';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    CustomerModule,
    ProductModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}