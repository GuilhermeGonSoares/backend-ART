import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { ContractService } from '../contract/contract.service';
import * as fs from 'fs';
import { CreateContractDto } from '../automations/dtos/create-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AutentiqueEntity } from './entities/autentique.entity';
import { IsNull, Repository } from 'typeorm';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';
import { ReturnDocumentDto } from './dtos/return-document.dto';
import { ProductType } from '../enums/product.enum';
import { GoogleDriveService } from '../google-drive/google-drive.service';
@Injectable()
export class AutentiqueService {
  private readonly AUTENTIQUE_URL = 'https://api.autentique.com.br/v2/graphql';
  private readonly AUTENTIQUE_TOKEN: string;
  private readonly logger = new Logger(AutentiqueService.name);

  constructor(
    @InjectRepository(AutentiqueEntity)
    private readonly repository: Repository<AutentiqueEntity>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly contractService: ContractService,
    private readonly googleDriveService: GoogleDriveService,
  ) {
    this.AUTENTIQUE_TOKEN = this.configService.get('AUTENTIQUE_TOKEN');
  }

  async findContractByAutentiqueId(
    autentiqueId: string,
  ): Promise<AutentiqueEntity> {
    const contract = await this.repository.findOne({
      where: { autentiqueId },
      relations: { charge: true, subscription: true },
    });

    if (!contract) {
      throw new NotFoundException(
        `Not found contract with this autentiqueId: ${autentiqueId}`,
      );
    }

    return contract;
  }

  async findContractWithPendingSignature(): Promise<AutentiqueEntity[]> {
    return await this.repository.find({
      where: {
        signatureStatus: AutentiqueStatus.PENDING,
      },
    });
  }

  async updateSignatureStatus(autentiqueId: string, status: AutentiqueStatus) {
    const contract = await this.repository.findOne({ where: { autentiqueId } });
    if (!contract) {
      throw new NotFoundException(
        `Not Found contract with this autentique id: ${autentiqueId}`,
      );
    }
    return this.repository.save({
      ...contract,
      signatureStatus: status,
    });
  }

  async createContractInDatabase(type: ProductType): Promise<AutentiqueEntity> {
    return await this.repository.save({
      type,
      signatureStatus: AutentiqueStatus.PENDING,
    });
  }

  async deleteContract(id: number) {
    const contract = await this.repository.findOne({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Not found contract with this ${id}`);
    }
    return await this.repository.remove(contract);
  }

  async updateContractWithNullAutentiqueId(
    customerId: string,
    autentiqueId: string,
    type: ProductType,
  ): Promise<AutentiqueEntity> {
    const subscription =
      type === ProductType.Subscription ? { customerId } : {};
    const charge = type === ProductType.Unique ? { customerId } : {};
    const contract = await this.repository.findOne({
      relations: {
        subscription: type === ProductType.Subscription ? true : false,
        charge: type === ProductType.Unique ? true : false,
      },
      where: {
        subscription,
        charge,
        signatureStatus: AutentiqueStatus.PENDING,
        autentiqueId: IsNull(),
      },
    });
    if (!contract) {
      throw new NotFoundException(
        `Not Found contract for this customerId with autentique_id null`,
      );
    }

    return this.repository.save({ ...contract, autentiqueId });
  }

  async findDocument(contractId: string): Promise<ReturnDocumentDto> {
    const query = `
      query {
        document(id: "${contractId}") {
          id
          name
          refusable
          sortable
          created_at
          signatures {
            public_id
            name
            email
            signed { ...event }
            rejected { ...event }
          }
        }
      }
      
      fragment event on Event {
        ip
        port
        reason
        created_at
      }
    `;
    const headers = {
      Authorization: `Bearer ${this.AUTENTIQUE_TOKEN}`,
    };

    const { data } = await this.httpService.axiosRef.post(
      this.AUTENTIQUE_URL,
      {
        query,
      },
      { headers },
    );
    return data.data.document.signatures[1];
  }

  async createDocument(contract: CreateContractDto) {
    try {
      // const pathDestiny = await this.contractService.replacePDFVariables(
      //   contract,
      //   '1qx4jIYedNiSgrRovdUDDKPq7wmVjXiTP',
      // );
      const fileId =
        await this.googleDriveService.copyAndReplaceVariablesInDocument(
          contract,
        );
      const pathDestiny = await this.googleDriveService.exportToPdf(fileId);

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

      await this.updateContractWithNullAutentiqueId(
        contract.customerCnpj,
        autentiqueContract.id,
        contract.type,
      );
      // await this.subscriptionService.updateSubscriptionWithNullContractId(
      //   contract.customerCnpj,
      //   autentiqueContract.id,
      // );
      fs.unlinkSync(pathDestiny);
      this.logger.log(
        `Arquivo do usuário: ${contract.customerName} enviado para AUTENTIQUE com sucesso!`,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateForNullAutentiqueId(id: number) {
    const contract = await this.repository.findOne({ where: { id } });

    if (!contract) {
      throw new NotFoundException(
        `Not found autentique contract with this: ${id}`,
      );
    }

    return await this.repository.save({ ...contract, autentiqueId: null });
  }
}
