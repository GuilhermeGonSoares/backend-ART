import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateContractDto } from './dtos/create-contract.dto';
import { AutentiqueService } from '../autentique/autentique.service';

@Processor('automations')
export class CreateContractConsumer {
  constructor(private readonly autentiqueService: AutentiqueService) {}
  @Process('autentique')
  async createContract(job: Job<CreateContractDto>) {
    const { data } = job;
    await this.autentiqueService.createDocument(data);
  }
}
