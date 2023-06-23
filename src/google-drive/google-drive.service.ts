import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { google, drive_v3 } from 'googleapis';
import { GoogleDriveEntity } from './entities/google-drive.entity';
import { Repository } from 'typeorm';
import { createReadStream } from 'fs';

@Injectable()
export class GoogleDriveService {
  private driveClient: drive_v3.Drive;
  private URL_DRIVE = 'https://drive.google.com/drive/folders';
  private readonly scopes = ['https://www.googleapis.com/auth/drive'];
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly REDIRECT_URI: string;
  private readonly REFRESH_TOKEN: string;
  private readonly GOOGLE_DRIVE_KEY: string;
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
    this.GOOGLE_DRIVE_KEY = configService.get('GOOGLE_DRIVE_KEY');
    this.driveClient = this.createDriveClient();
  }
  createDriveClient() {
    const client = new google.auth.OAuth2({
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      redirectUri: this.REDIRECT_URI,
    });

    client.setCredentials({ refresh_token: this.REFRESH_TOKEN });

    return google.drive({
      version: 'v3',
      auth: client,
    });
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

  async getFileInfo(fileId: string): Promise<ArrayBuffer> {
    // Carrega o conteúdo do arquivo do Google Drive
    const fileContent = await this.driveClient.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'arraybuffer' },
    );
    return fileContent.data as ArrayBuffer;
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
    console.log('GOOGLE DRIVE CRIADO');
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
    const folder = await this.findFolderId(folderId).catch(() => undefined);

    if (folder) {
      throw new BadRequestException(`Already exist folderId: ${folderId}`);
    }

    return await this.repository.save({
      customerId,
      folderId,
      link: this.URL_DRIVE + '/' + folderId,
    });
  }

  async findFolderId(folderId: string) {
    const folder = await this.repository.findOne({ where: { folderId } });

    if (!folder) {
      throw new NotFoundException(`Not Found folderId: ${folderId}`);
    }

    return folder;
  }
}
