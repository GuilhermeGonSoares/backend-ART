import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAsaasClientDto } from './dtos/create-client.dto';
import { UpdateAsaasClientDto } from './dtos/update-client.dto';
import { CreateAsaasChargeDto } from './dtos/create-charge.dto';

@Injectable()
export class AsaasService {
  private readonly ASAAS_URL = 'https://sandbox.asaas.com/api/v3';
  private readonly ASAAS_KEY: string;
  private readonly headers: { access_token: string };
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ASAAS_KEY = this.configService.get('ASASS_KEY');
    this.headers = { access_token: this.ASAAS_KEY };
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
    const url = `${this.ASAAS_URL}/customers/${updateAsaasCustomerDto.asaasId}`;
    const data = { ...updateAsaasCustomerDto };

    await this.httpService.axiosRef.post(url, data, { headers: this.headers });
  }

  async deleteClient(asaasId: string) {
    try {
      const url = `${this.ASAAS_URL}/customers/${asaasId}`;
      await this.httpService.axiosRef.delete(url, { headers: this.headers });
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
      console.log('delete charge');
      const url = `${this.ASAAS_URL}/payments/${asaasId}`;
      await this.httpService.axiosRef.delete(url, { headers: this.headers });
      console.log('charge deletada com sucesso');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
