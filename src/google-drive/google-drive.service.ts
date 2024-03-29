import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { google, drive_v3, docs_v1 } from 'googleapis';
import { GoogleDriveEntity } from './entities/google-drive.entity';
import { Repository } from 'typeorm';
import { createReadStream } from 'fs';
import { CreateContractDto } from '../automations/dtos/create-contract.dto';
import { variablesContract } from '../utils/variables-contract/variables';
@Injectable()
export class GoogleDriveService {
  private driveClient: drive_v3.Drive;
  private docClient: docs_v1.Docs;
  private URL_DRIVE = 'https://drive.google.com/drive/folders';
  private readonly scopes = ['https://www.googleapis.com/auth/drive'];
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly REDIRECT_URI: string;
  private readonly REFRESH_TOKEN: string;
  private readonly PARENT_FOLDER_CREATE_FOLDER: string;
  private readonly PARENT_FOLDER_CONTRATO_CLIENT: string;
  private readonly logger = new Logger(GoogleDriveService.name);

  constructor(
    @InjectRepository(GoogleDriveEntity)
    private readonly repository: Repository<GoogleDriveEntity>,
    private readonly configService: ConfigService,
  ) {
    this.CLIENT_ID = configService.get('CLIENT_ID');
    this.CLIENT_SECRET = configService.get('CLIENT_SECRET');
    this.REDIRECT_URI = configService.get('REDIRECT_URI');
    this.REFRESH_TOKEN = configService.get('REFRESH_TOKEN');
    this.PARENT_FOLDER_CREATE_FOLDER = configService.get(
      'PARENT_FOLDER_CREATE_FOLDER',
    );
    this.PARENT_FOLDER_CONTRATO_CLIENT = configService.get(
      'PARENT_FOLDER_CONTRATO_CLIENT',
    );
    this.createClient();
  }
  createClient() {
    const client = new google.auth.OAuth2({
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      redirectUri: this.REDIRECT_URI,
    });

    client.setCredentials({ refresh_token: this.REFRESH_TOKEN });
    this.driveClient = google.drive({
      version: 'v3',
      auth: client,
    });

    this.docClient = google.docs({
      version: 'v1',
      auth: client,
    });
  }

  async convert(fileId: string) {
    const copyResponse = await this.driveClient.files.copy({
      fileId,
      requestBody: {
        mimeType: 'application/vnd.google-apps.document',
      },
    });

    // ID da cópia convertida no formato do Google Docs
    const convertedFileID = copyResponse.data.id;
    console.log(
      `Arquivo convertido para o formato do Google Docs. ID: ${convertedFileID}`,
    );
  }
  async checkDocumentExists(documentId: string): Promise<boolean> {
    try {
      await this.driveClient.files.get({
        fileId: documentId,
      });
      // Se a solicitação for bem-sucedida e não lançar exceção, significa que o documento existe
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //AQUI NO EXPORT COLOCAR PARA SALVAR DENTRO DA PASTA CONTRATOS PDF O EXPORTPDF
  async exportToPdf(fileId: string) {
    try {
      const exportResponse = await this.driveClient.files.export(
        {
          fileId,
          mimeType: 'application/pdf',
        },
        { responseType: 'stream' },
      );
      this.logger.log('Arquivo exportado como PDF com sucesso!');
      return exportResponse.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteFileFromGoogleDrive(fileId: string): Promise<void> {
    await this.driveClient.files.delete({
      fileId: fileId,
    });
  }

  async uploadFileOnGoogleDrive(
    filePath: string,
    folderId: string,
    customerName: string,
  ) {
    try {
      const response = await this.driveClient.files.create({
        requestBody: {
          name: `Contrato do cliente ${customerName}`,
          parents: [folderId],
        },
        media: {
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          body: createReadStream(filePath),
        },
      });
      this.logger.log('Arquivo salvo no google drive com sucesso!');
      return response.data.id;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async copyAndReplaceVariablesInDocument(contract: CreateContractDto) {
    try {
      const { fileId } = contract;
      const variables = variablesContract(contract);
      const copyResponse = await this.driveClient.files.copy({
        fileId,
        requestBody: {
          name: `${contract.name} - ${contract.customerName}`,
          mimeType: 'application/vnd.google-apps.document',
          parents: [this.PARENT_FOLDER_CONTRATO_CLIENT],
        },
      });
      const convertedFileID = copyResponse.data.id;
      this.logger.log(
        `Arquivo convertido para o formato do Google Docs. ID: ${convertedFileID}`,
      );
      const requests = [];

      for (const variable in variables) {
        if (variables.hasOwnProperty(variable)) {
          const value = variables[variable];

          requests.push({
            replaceAllText: {
              replaceText: value,
              containsText: {
                text: `{{${variable}}}`,
                matchCase: true,
              },
            },
          });
        }
      }
      await this.docClient.documents.batchUpdate({
        documentId: convertedFileID,
        requestBody: {
          requests: requests,
        },
      });
      return convertedFileID;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async copyFileAndReturnYourId(folderId: string) {
    const file = await this.findFileIdOnGoogleDrive(folderId);
    const copiedFile = await this.driveClient.files.copy({
      fileId: file.id,
      requestBody: {
        name: `${Date.now()}-${file.name}`,
        parents: [folderId],
      },
    });

    return copiedFile.data.id;
  }

  //quero salvar o filedId no banco de dados para nao precisar usar essa request a api do google drive
  async findFileIdOnGoogleDrive(folderId: string) {
    // Consulta os arquivos na pasta específica
    const response = await this.driveClient.files.list({
      q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });
    // Verifica se há algum arquivo correspondente
    if (response.data.files.length > 0) {
      // Itera sobre os arquivos encontrados na pasta
      for (const file of response.data.files) {
        if (file.name === 'Contrato SM.docx') {
          return file;
        }
      }
    }
    throw new BadRequestException(
      'Nenhum arquivo encontrado na pasta com o ID especificado.',
    );
  }

  async createFolder(folderName: string, customerId: string) {
    const response = await this.driveClient.files.create({
      requestBody: {
        name: 'TFG - ' + folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.PARENT_FOLDER_CREATE_FOLDER],
      },
      fields: 'id, name',
    });
    const folderId = response.data.id;

    await this.driveClient.permissions.create({
      fileId: folderId,
      requestBody: {
        type: 'anyone',
        role: 'writer',
      },
    });

    await this.createFolderInSharedDrive(
      folderId,
      'Briefing',
      'Contrato',
      'Materiais',
    );

    const folder = await this.saveGoogleDriveRegister(folderId, customerId);
    this.logger.log('Google drive criado com sucesso!');
    return folder.link;
  }

  async createFolderInSharedDrive(
    sharedDriveId: string,
    ...folderName: string[]
  ) {
    folderName.forEach(async (folder) => {
      const response = await this.driveClient.files.create({
        requestBody: {
          name: folder,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [sharedDriveId],
        },
        fields: 'id, name',
      });
      if (response.data.name === 'Materiais') {
        this.createFolderInSharedDrive(
          response.data.id,
          '01.Logotipo',
          '02.Artes Avulsas',
          '03.Identidade Visual',
          '04.Criativos',
          '05.Instalações',
        );
      }
    });
  }

  async saveGoogleDriveRegister(folderId: string, customerId: string) {
    const folder = await this.repository.findOne({ where: { folderId } });

    if (folder) {
      throw new BadRequestException(`Already exist folderId: ${folderId}`);
    }

    return await this.repository.save({
      customerId,
      folderId,
      link: this.URL_DRIVE + '/' + folderId,
    });
  }

  async findFolderByCustomerId(customerId: string) {
    const folder = await this.repository.findOne({ where: { customerId } });

    if (!folder) {
      throw new NotFoundException(
        `Not Found folder by customer id: ${customerId}`,
      );
    }

    return folder;
  }
}
