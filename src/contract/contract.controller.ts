import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateContractTemplateDto } from './dtos/update-contract.dto';
import { CreateContractTemplateDto } from './dtos/create-contract.dto';

@ApiTags('Contract')
@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post()
  async create(@Body() contractDto: CreateContractTemplateDto) {
    return await this.contractService.createContract(contractDto);
  }

  @Get()
  async list() {
    return await this.contractService.listContracts();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateContractTemplateDto,
  ) {
    return await this.contractService.updateContract(id, updateDto);
  }
}
