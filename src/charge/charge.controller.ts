import { Body, Controller, Post } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';

@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Post()
  async createCharge(@Body() chargeDto: CreateChargeDto) {
    return this.chargeService.create(chargeDto);
  }
}
