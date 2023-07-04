import { Body, Controller, Post } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dtos/create-automation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationService: AutomationsService) {}

  @Post()
  async create(@Body() automationDto: CreateAutomationDto) {
    return await this.automationService.createAutomations(automationDto);
  }
}
