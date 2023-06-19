import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { ContractService } from '../contract/contract.service';
import * as fs from 'fs';
import { CreateContractDto } from '../automations/dtos/create-contract.dto';
import { SubscriptionService } from '../subscription/subscription.service';
@Injectable()
export class AutentiqueService {
  private readonly AUTENTIQUE_URL = 'https://api.autentique.com.br/v2/graphql';
  private readonly AUTENTIQUE_TOKEN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly contractService: ContractService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.AUTENTIQUE_TOKEN = this.configService.get('AUTENTIQUE_TOKEN');
  }

  async createDocument(contract: CreateContractDto) {
    try {
      const pathDestiny = await this.contractService.replacePDFVariables(
        contract,
        '1qx4jIYedNiSgrRovdUDDKPq7wmVjXiTP',
      );

      const query = `mutation CreateDocumentMutation(
        $document: DocumentInput!,
        $signers: [SignerInput!]!,
        $file: Upload!
      ) {
        createDocument(
          sandbox: true,
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
          document: {
            name: `Contrato do cliente ${contract.customerName}`,
            refusable: true,
          },
          expiration: {
            // Envia um lembrete em uma quantidade de dias "days_before antes do
            // vencimento do documento informada no "notify_at"
            days_before: 2,
          },
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
      const { data } = await this.httpService.axiosRef.post(
        this.AUTENTIQUE_URL,
        formData,
        {
          headers,
        },
      );
      const autentiqueContract = { ...data.data.createDocument };
      await this.subscriptionService.updateSubscriptionWithNullContractId(
        contract.customerCnpj,
        autentiqueContract.id,
      );
      fs.unlinkSync(pathDestiny);
      console.log('Arquivo enviado para AUTENTIQUE com sucesso!');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
