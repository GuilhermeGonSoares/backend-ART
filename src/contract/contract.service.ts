import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContractService {
  private readonly uploadPath = path.join(__dirname, '..', 'uploads');

  constructor(
    @InjectRepository(ContractEntity)
    private readonly repository: Repository<ContractEntity>,
  ) {}

  async saveFile(file: Express.Multer.File) {
    const newFileName = `${Date.now()}-${file.originalname}`; // Novo nome do arquivo com extensão .pdf
    const filePath = path.join('./uploads', newFileName);
    fs.rename(file.path, filePath, (error) => {
      if (error) {
        console.error('Erro ao renomear o arquivo:', error);
        throw new InternalServerErrorException('Erro ao renomear o arquivo');
      }
    });
    return await this.repository.save({
      filePath,
      name: file.originalname,
    });
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
