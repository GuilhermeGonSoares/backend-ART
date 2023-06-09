import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { ReturnSubscriptionDto } from './dtos/return-subscription.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Body() subscriptionDto: CreateSubscriptionDto,
  ): Promise<ReturnSubscriptionDto> {
    return new ReturnSubscriptionDto(
      await this.subscriptionService.create(subscriptionDto),
    );
  }

  @Get()
  async listSubscription(): Promise<ReturnSubscriptionDto[]> {
    return (await this.subscriptionService.list()).map(
      (subscription) => new ReturnSubscriptionDto(subscription),
    );
  }

  @Get('customer/:customerId')
  async showSubscriptionWithRelations(
    @Param('customerId') customerId: string,
  ): Promise<ReturnSubscriptionDto> {
    return new ReturnSubscriptionDto(
      await this.subscriptionService.findActiveSubscriptionByCustomerId(
        customerId,
        true,
      ),
    );
  }

  @Put('customer/:customerId')
  async update(
    @Param('customerId') customerId: string,
    @Body() subscriptionDto: UpdateSubscriptionDto,
  ): Promise<ReturnSubscriptionDto> {
    return new ReturnSubscriptionDto(
      await this.subscriptionService.updateSubscription(
        customerId,
        subscriptionDto,
      ),
    );
  }

  @Delete('customer/:customerId')
  async delete(
    @Param('customerId') customerId: string,
  ): Promise<ReturnSubscriptionDto> {
    return new ReturnSubscriptionDto(
      await this.subscriptionService.deleteActiveSubscription(customerId),
    );
  }
}
