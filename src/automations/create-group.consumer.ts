import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { CreateGroupDto } from '../automations/dtos/create-group.dto';

@Processor('automations')
export class CreateGroupConsumer {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Process('createGroup')
  async createGroup(job: Job<CreateGroupDto>) {
    const { data } = job;

    await this.whatsappService.createGroup(data);
  }
}
