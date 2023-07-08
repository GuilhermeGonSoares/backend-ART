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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({ status: 201, type: ReturnSubscriptionDto })
  @Post()
  async createSubscription(
    @Body() subscriptionDto: CreateSubscriptionDto,
  ): Promise<ReturnSubscriptionDto> {
    return new ReturnSubscriptionDto(
      await this.subscriptionService.create(subscriptionDto),
    );
  }

  @ApiOperation({ summary: 'Get a list of subscriptions' })
  @ApiResponse({ status: 200, type: ReturnSubscriptionDto, isArray: true })
  @Get()
  async listSubscription(): Promise<ReturnSubscriptionDto[]> {
    return (await this.subscriptionService.list()).map(
      (subscription) => new ReturnSubscriptionDto(subscription),
    );
  }

  @ApiOperation({ summary: 'Get a subscription by customer ID' })
  @ApiParam({ name: 'customerId', description: 'The ID of the customer' })
  @ApiResponse({ status: 200, type: ReturnSubscriptionDto })
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

  @ApiOperation({ summary: 'Update a subscription by customer ID' })
  @ApiParam({ name: 'customerId', description: 'The ID of the customer' })
  @ApiBody({ type: UpdateSubscriptionDto })
  @ApiResponse({ status: 200, type: ReturnSubscriptionDto })
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

  @ApiOperation({ summary: 'Delete a subscription by customer ID' })
  @ApiParam({ name: 'customerId', description: 'The ID of the customer' })
  @ApiResponse({ status: 200, type: ReturnSubscriptionDto })
  @Delete('customer/:customerId')
  async delete(
    @Param('customerId') customerId: string,
  ): Promise<ReturnSubscriptionDto> {
    return new ReturnSubscriptionDto(
      await this.subscriptionService.deleteActiveSubscription(customerId),
    );
  }
}
