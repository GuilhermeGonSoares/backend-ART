import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { ReturnCustomerDto } from './dtos/return-customer.dto';

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
      await this.customerService.findCustomerByCnpj(cnpj),
    );
  }
}
