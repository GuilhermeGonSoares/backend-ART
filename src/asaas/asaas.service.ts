import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from '../customer/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../customer/dtos/update-customer.dto';
import { CustomerEntity } from '../customer/entities/customer.entity';

@Injectable()
export class AsaasService {
  private readonly ASAAS_URL = 'https://sandbox.asaas.com/api/v3/';
  private readonly ASAAS_KEY: string;
  private readonly headers: { access_token: string };
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ASAAS_KEY = this.configService.get('ASASS_KEY');
    this.headers = { access_token: this.ASAAS_KEY };
  }

  async createClient(createCustomerDto: CreateCustomerDto) {
    try {
      const url = this.ASAAS_URL + 'customers';

      const data = {
        name: createCustomerDto.name,
        cpfCnpj: createCustomerDto.cnpj,
        email: createCustomerDto.financeEmail,
        phone: createCustomerDto.financePhone,
        mobilePhone: createCustomerDto.mainPhone,
      };
      const response = await this.httpService.axiosRef.post(url, data, {
        headers: this.headers,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateClient(
    customer: CustomerEntity,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const url = `${this.ASAAS_URL}/customers/${customer.asaasId}`;
    const data = {
      name: updateCustomerDto.name ? updateCustomerDto.name : customer.name,
      cpfCnpj: updateCustomerDto.cnpj ? updateCustomerDto.cnpj : customer.cnpj,
      email: updateCustomerDto.financeEmail,
      phone: updateCustomerDto.financePhone,
      mobilePhone: updateCustomerDto.mainPhone,
    };

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
}
