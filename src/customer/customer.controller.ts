import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { ReturnCustomerDto } from './dtos/return-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ReturnCustomerDto> {
    return new ReturnCustomerDto(
      await this.customerService.create(createCustomerDto),
    );
  }

  @Get()
  async listCustomers(): Promise<ReturnCustomerDto[]> {
    return (await this.customerService.list()).map(
      (customer) => new ReturnCustomerDto(customer),
    );
  }

  @Get(':cnpj')
  async showCustomer(@Param('cnpj') cnpj: string): Promise<ReturnCustomerDto> {
    return new ReturnCustomerDto(
      await this.customerService.findCustomerBy('cnpj', cnpj),
    );
  }

  @Put(':cnpj')
  async updateCustomer(
    @Param('cnpj') cnpj: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return new ReturnCustomerDto(
      await this.customerService.update(cnpj, updateCustomerDto),
    );
  }

  @Delete(':cnpj')
  async deleteCustomer(@Param('cnpj') cnpj: string) {
    return new ReturnCustomerDto(await this.customerService.delete(cnpj));
  }
}
