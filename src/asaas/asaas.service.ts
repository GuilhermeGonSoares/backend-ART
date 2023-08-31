import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAsaasClientDto } from './dtos/create-client.dto';
import { UpdateAsaasClientDto } from './dtos/update-client.dto';
import { CreateAsaasChargeDto } from './dtos/create-charge.dto';

@Injectable()
export class AsaasService {
  private readonly ASAAS_URL = 'https://sandbox.asaas.com/api/v3';
  private readonly ASAAS_KEY: string;
  private readonly headers: { access_token: string };
  private readonly logger = new Logger(AsaasService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ASAAS_KEY = this.configService.get('ASASS_KEY');
    this.headers = { access_token: this.ASAAS_KEY };
  }

  async findClient(asaasId: string) {
    try {
      const url = `${this.ASAAS_URL}/customers/${asaasId}`;

      const { data } = await this.httpService.axiosRef.get(url, {
        headers: this.headers,
      });
      return data;
    } catch (error) {
      if (!(error.response && error.response.status === 404)) {
        throw new BadRequestException(error);
      }
    }
  }

  async createClient(createAsaasCustomerDto: CreateAsaasClientDto) {
    try {
      const url = `${this.ASAAS_URL}/customers`;

      const data = { ...createAsaasCustomerDto };
      const response = await this.httpService.axiosRef.post(url, data, {
        headers: this.headers,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateClient(updateAsaasCustomerDto: UpdateAsaasClientDto) {
    try {
      const { asaasId } = updateAsaasCustomerDto;
      const client = await this.findClient(asaasId).catch(() => undefined);

      if (client && client.cannotEditReason === null) {
        const url = `${this.ASAAS_URL}/customers/${asaasId}`;
        const data = { ...updateAsaasCustomerDto };

        return await this.httpService.axiosRef.post(url, data, {
          headers: this.headers,
        });
      }
      if (client && client.cannotEditReason) {
        this.logger.error(client.cannotEditReason);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteClient(asaasId: string) {
    try {
      const client = await this.findClient(asaasId).catch(() => undefined);
      if (client && client.cannotBeDeletedReason === null) {
        const url = `${this.ASAAS_URL}/customers/${asaasId}`;
        await this.httpService.axiosRef.delete(url, { headers: this.headers });
      }
      if (client && client.cannotBeDeletedReason) {
        this.logger.error(client.cannotBeDeletedReason);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createCharge(createCharge: CreateAsaasChargeDto) {
    try {
      const url = `${this.ASAAS_URL}/payments`;
      const data = { ...createCharge };
      const response = await this.httpService.axiosRef.post(url, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteCharge(asaasId: string) {
    try {
      const url = `${this.ASAAS_URL}/payments/${asaasId}`;
      await this.httpService.axiosRef.delete(url, { headers: this.headers });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
