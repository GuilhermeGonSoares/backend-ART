import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() subscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(subscriptionDto);
  }

  @Get('customer/:customerId')
  async showSubscriptionWithRelations(@Param('customerId') customerId: string) {
    return this.subscriptionService.findSubscriptionActiveByCustomerId(
      customerId,
      true,
    );
  }
}
