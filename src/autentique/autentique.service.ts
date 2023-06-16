import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { IContract } from '../contract/interfaces/contract.interface';
import { ContractService } from '../contract/contract.service';
import * as fs from 'fs';
@Injectable()
export class AutentiqueService {
  private readonly AUTENTIQUE_URL = 'https://api.autentique.com.br/v2/graphql';
  private readonly AUTENTIQUE_TOKEN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly contractService: ContractService,
  ) {
    this.AUTENTIQUE_TOKEN = this.configService.get('AUTENTIQUE_TOKEN');
  }

  async createDocument(contract: IContract) {
    try {
      const pathDestiny = await this.contractService.replacePDFVariables(
        contract,
        '1qx4jIYedNiSgrRovdUDDKPq7wmVjXiTP',
      );

      console.log(pathDestiny);
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
          document: { name: `Contrato do cliente ${contract.customerName}` },
          signers: [
            {
              email: contract.customerEmail,
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
      formData.append('file', createReadStream(pathDestiny));

      const headers = {
        Authorization: `Bearer ${this.AUTENTIQUE_TOKEN}`,
        ...formData.getHeaders(),
      };
      await this.httpService.axiosRef.post(this.AUTENTIQUE_URL, formData, {
        headers,
      });
      fs.unlinkSync(pathDestiny);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
