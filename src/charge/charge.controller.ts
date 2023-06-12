import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { ReturnChargeDto } from './dto/return-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Post()
  async createCharge(
    @Body() chargeDto: CreateChargeDto,
  ): Promise<ReturnChargeDto> {
    return new ReturnChargeDto(await this.chargeService.create(chargeDto));
  }

  @Get('customer/:customerId')
  async showChargeWithRelations(
    @Param('customerId') customerId: string,
  ): Promise<ReturnChargeDto[]> {
    return (await this.chargeService.findChargeByCnpj(customerId, true)).map(
      (charge) => new ReturnChargeDto(charge),
    );
  }

  @Put(':id')
  async updateCharge(
    @Param('id') id: string,
    @Body() chargeDto: UpdateChargeDto,
  ): Promise<ReturnChargeDto> {
    return new ReturnChargeDto(await this.chargeService.update(+id, chargeDto));
  }

  @Delete(':id')
  async deleteCharge(@Param('id') id: string): Promise<ReturnChargeDto> {
    return new ReturnChargeDto(await this.chargeService.delete(+id));
  }
}
