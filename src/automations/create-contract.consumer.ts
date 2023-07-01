import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateContractDto } from './dtos/create-contract.dto';
import { AutentiqueService } from '../autentique/autentique.service';
import { Logger } from '@nestjs/common';

@Processor('automations')
export class CreateContractConsumer {
  private readonly logger = new Logger(CreateContractConsumer.name);

  constructor(private readonly autentiqueService: AutentiqueService) {}

  @Process('autentique')
  async createContract(job: Job<CreateContractDto>) {
    const { data } = job;
    await this.autentiqueService.createDocument(data);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      'Falha ao processar o job de criação de contrato',
      error.stack,
    );
  }
}
