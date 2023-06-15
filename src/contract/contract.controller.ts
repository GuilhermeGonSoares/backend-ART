import {
  Body,
  Controller,
  Param,
  ParseFilePipe,
  Post,
  Res,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Nome do campo do arquivo na requisição
  async createContractWithFile(
    @UploadedFile(new ParseFilePipe()) file: Express.Multer.File,
  ) {
    return await this.contractService.saveFile(file);
  }
}
