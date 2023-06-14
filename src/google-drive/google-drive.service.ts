import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, drive_v3 } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private driveClient: drive_v3.Drive;
  private readonly scopes = ['https://www.googleapis.com/auth/drive'];
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly REDIRECT_URI: string;
  private readonly REFRESH_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    this.CLIENT_ID = configService.get('CLIENT_ID');
    this.CLIENT_SECRET = configService.get('CLIENT_SECRET');
    this.REDIRECT_URI = configService.get('REDIRECT_URI');
    this.REFRESH_TOKEN = configService.get('REFRESH_TOKEN');
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

  async createFolder(folderName: string) {
    const response = await this.driveClient.files.create({
      requestBody: {
        name: folderName,
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

    this.createFolderInSharedDrive(
      folderId,
      'Briefing',
      'Contrato',
      'Materiais',
    );

    return folderId;
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
}
