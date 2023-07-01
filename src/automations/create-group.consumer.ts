import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { CreateGroupDto } from '../automations/dtos/create-group.dto';
import { Logger } from '@nestjs/common';

@Processor('automations')
export class CreateGroupConsumer {
  private readonly logger = new Logger(CreateGroupConsumer.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  @Process('createGroup')
  async createGroup(job: Job<CreateGroupDto>) {
    const { data } = job;

    await this.whatsappService.createGroup(data);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      'Falha ao processar o job de criação do whatsapp group',
      error.stack,
    );
  }
}
