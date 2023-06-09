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

  // async saveFile(file: Express.Multer.File) {
  //   const newFileName = `${Date.now()}-${file.originalname}`; // Novo nome do arquivo com extensão .pdf
  //   const filePath = path.join('./uploads', newFileName);
  //   fs.rename(file.path, filePath, (error) => {
  //     if (error) {
  //       this.logger.error('Erro ao renomear o arquivo:', error);
  //       throw new InternalServerErrorException('Erro ao renomear o arquivo');
  //     }
  //   });
  //   return await this.repository.save({
  //     filePath,
  //     name: file.originalname,
  //   });
  // }

  // async replacePDFVariables(contract: CreateContractDto, folderId: string) {
  //   const copyFile = fs.readFileSync(contract.fileId);
  //   const pathCopyFile = `./uploads/temp-${Date.now()}-${contract.name}`;

  //   fs.writeFileSync(pathCopyFile, copyFile);
  //   const content = fs.readFileSync(pathCopyFile, 'binary');
  //   const data = {
  //     nomeempresa: contract.customerName,
  //     numerocnpj: contract.customerCnpj,
  //     valor: contract.finalPrice,
  //     numerodeposts: contract.numberOfPosts,
  //     dataassinatura: contract.signatureDate,
  //     prazoemdias: contract.contractTimeDays,
  //   };

  //   const zip = new PizZip(content);

  //   const doc = new Docxtemplater(zip, {
  //     paragraphLoop: true,
  //     linebreaks: true,
  //   });

  //   doc.render(data);
  //   const buf = doc.getZip().generate({
  //     type: 'nodebuffer',
  //     // compression: DEFLATE adds a compression step.
  //     // For a 50MB output document, expect 500ms additional CPU time
  //     compression: 'DEFLATE',
  //   });

  //   fs.writeFileSync(pathCopyFile, buf);

  //   try {
  //     const [, pathDestiny] = await Promise.all([
  //       this.googleService.uploadFileOnGoogleDrive(
  //         pathCopyFile,
  //         folderId,
  //         contract.customerName,
  //       ),
  //       this.convertDocToPdf(pathCopyFile, contract.name),
  //     ]);
  //     fs.unlinkSync(pathCopyFile);
  //     return pathDestiny;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  // async getTokenILovePdf() {
  //   const response = await this.httpService.axiosRef.post(
  //     'https://api.ilovepdf.com/v1/auth',
  //     {
  //       public_key: this.ILOVEPDF_PUBLIC_KEY,
  //     },
  //   );
  //   this.ILOVEPDF_TOKEN = response.data.token;
  // }

  // async getServeAndTask() {
  //   const headers = {
  //     Authorization: `Bearer ${this.ILOVEPDF_TOKEN}`,
  //   };
  //   const response = await this.httpService.axiosRef.get(
  //     'https://api.ilovepdf.com/v1/start/officepdf',
  //     {
  //       headers,
  //     },
  //   );
  //   this.ILOVEPDF_SERVER = response.data.server;
  //   this.ILOVEPDF_TASK_ID = response.data.task;
  // }

  // async uploadFileToTask(filePath: string) {
  //   const url = `https://${this.ILOVEPDF_SERVER}/v1/upload`;

  //   const form = new FormData();
  //   form.append('task', this.ILOVEPDF_TASK_ID);
  //   form.append('file', fs.createReadStream(filePath));

  //   const headers = {
  //     ...form.getHeaders(),
  //     Authorization: `Bearer ${this.ILOVEPDF_TOKEN}`,
  //   };

  //   const response = await this.httpService.axiosRef.post(url, form, {
  //     headers,
  //   });
  //   return response.data.server_filename;
  // }

  // async convertDocToPdf(filePath: string, fileName: string) {
  //   await this.getTokenILovePdf();
  //   await this.getServeAndTask();
  //   const serverFilename = await this.uploadFileToTask(filePath);

  //   const url = `https://${this.ILOVEPDF_SERVER}/v1/process`;
  //   const file = [
  //     {
  //       server_filename: serverFilename,
  //       filename: fileName,
  //     },
  //   ];

  //   const data = {
  //     task: this.ILOVEPDF_TASK_ID,
  //     tool: 'officepdf', // Substitua pelo valor da ferramenta desejada
  //     files: file,
  //   };
  //   const headers = {
  //     Authorization: `Bearer ${this.ILOVEPDF_TOKEN}`,
  //   };
  //   await this.httpService.axiosRef.post(url, data, {
  //     headers,
  //   });

  //   const urlDownload = `https://${this.ILOVEPDF_SERVER}/v1/download/${this.ILOVEPDF_TASK_ID}`;
  //   const downloadResponse = await this.httpService.axiosRef.get(urlDownload, {
  //     headers,
  //     responseType: 'arraybuffer',
  //   });

  //   const pathDestiny = './uploads/' + serverFilename.split('.')[0] + '.pdf';
  //   const pdfData = Buffer.from(downloadResponse.data, 'binary');
  //   fs.writeFileSync(pathDestiny, pdfData);
  //   this.logger.log('Arquivo convertido e salvo com sucesso!');
  //   return pathDestiny;
  // }
}
