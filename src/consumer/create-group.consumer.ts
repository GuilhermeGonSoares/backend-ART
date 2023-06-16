import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { CreateGroupDto } from './dtos/create-group.dto';

@Processor('automations')
export class CreateGroupConsumer {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Process('createGroup')
  async createGroup(job: Job<CreateGroupDto>) {
    const { data } = job;
    console.log(data);

    await this.whatsappService.createGroup(data);
  }
}
