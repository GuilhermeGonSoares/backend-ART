import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { Repository } from 'typeorm';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { CreateContractTemplateDto } from './dtos/create-contract.dto';
import { UpdateContractTemplateDto } from './dtos/update-contract.dto';
@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(ContractEntity)
    private readonly repository: Repository<ContractEntity>,
    private readonly googleService: GoogleDriveService,
  ) {}

  async createContract(contractDto: CreateContractTemplateDto) {
    const { name, fileId } = contractDto;
    const contract = await this.findContractBy('name', name).catch(
      () => undefined,
    );
    if (contract) {
      throw new BadRequestException(
        `Already exist this contract name: ${name}`,
      );
    }
    await this.googleService.checkDocumentExists(fileId);

    return await this.repository.save({ ...contractDto });
  }

  async listContracts() {
    return await this.repository.find();
  }

  async updateContract(id: number, contractDto: UpdateContractTemplateDto) {
    const contract = await this.findContractBy('id', id);
    const { fileId } = contractDto;
    if (fileId) {
      await this.googleService.checkDocumentExists(fileId);
    }

    return await this.repository.save({ ...contract, ...contractDto });
  }

  async deleteContrac(id: number) {
    const contract = await this.findContractBy('id', id);
    await this.googleService.deleteFileFromGoogleDrive(contract.fileId);
    return await this.repository.remove(contract);
  }

  async findContractBy<K extends keyof ContractEntity>(
    key: K,
    value: ContractEntity[K],
  ) {
    const contract = await this.repository.findOne({ where: { [key]: value } });

    if (!contract) {
      throw new NotFoundException(`Not Found contract with ${[key]}: ${value}`);
    }

    return contract;
  }
}
