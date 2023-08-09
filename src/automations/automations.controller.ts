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
    const { initialDate } = automationDto;
    const currentUTCDate = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    ).setUTCHours(0, 0, 0, 0);

    if (new Date(initialDate).setUTCHours(0, 0, 0, 0) >= currentUTCDate) {
      return await this.automationService.saveAutomation(automationDto);
    }

    return await this.automationService.createAutomations(automationDto);
  }
}
