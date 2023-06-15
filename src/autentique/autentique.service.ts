import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';

@Injectable()
export class AutentiqueService {
  private readonly AUTENTIQUE_URL = 'https://api.autentique.com.br/v2/graphql';
  private readonly AUTENTIQUE_TOKEN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.AUTENTIQUE_TOKEN = this.configService.get('AUTENTIQUE_TOKEN');
  }

  async createDocument(
    customerName: string,
    customerEmail: string,
    filePath: string,
  ) {
    try {
      const query = `mutation CreateDocumentMutation(
        $document: DocumentInput!,
        $signers: [SignerInput!]!,
        $file: Upload!
      ) {
        createDocument(
          document: $document,
          signers: $signers,
          file: $file
        ) {
          id
          name
          refusable
          sortable
          created_at
          signatures {
            public_id
            name
            email
            created_at
            action { name }
            link { short_link }
            user { id name email }
          }
        }
      }`;

      const operations = JSON.stringify({
        query,
        variables: {
          document: { name: `Contrato do cliente ${customerName}` },
          signers: [
            {
              email: customerEmail,
              action: 'SIGN',
            },
          ],
          file: null,
        },
      });

      const map = JSON.stringify({ file: ['variables.file'] });

      const formData = new FormData({});
      formData.append('operations', operations);
      formData.append('map', map);
      formData.append('file', createReadStream(filePath));

      const headers = {
        Authorization: `Bearer ${this.AUTENTIQUE_TOKEN}`,
        ...formData.getHeaders(),
      };
      await this.httpService.axiosRef.post(this.AUTENTIQUE_URL, formData, {
        headers,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error creating a contract ',
      );
    }
  }
}
