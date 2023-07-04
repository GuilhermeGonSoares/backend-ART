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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: ReturnCustomerDto,
  })
  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ReturnCustomerDto> {
    createCustomerDto.cnpj = createCustomerDto.cnpj.replace(/[^\d]+/g, '');
    return new ReturnCustomerDto(
      await this.customerService.create(createCustomerDto),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a list of customers',
    type: ReturnCustomerDto,
    isArray: true,
  })
  @Get()
  async listCustomers(): Promise<ReturnCustomerDto[]> {
    return (await this.customerService.list()).map(
      (customer) => new ReturnCustomerDto(customer),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Return a customer by CNPJ',
    type: ReturnCustomerDto,
  })
  @Get(':cnpj')
  async showCustomer(@Param('cnpj') cnpj: string): Promise<ReturnCustomerDto> {
    return new ReturnCustomerDto(
      await this.customerService.findCustomerBy('cnpj', cnpj),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Return a updated customer by CNPJ',
    type: ReturnCustomerDto,
  })
  @Put(':cnpj')
  async updateCustomer(
    @Param('cnpj') cnpj: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return new ReturnCustomerDto(
      await this.customerService.update(cnpj, updateCustomerDto),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Return a deleted customer by CNPJ',
    type: ReturnCustomerDto,
  })
  @Delete(':cnpj')
  async deleteCustomer(@Param('cnpj') cnpj: string) {
    return new ReturnCustomerDto(await this.customerService.delete(cnpj));
  }
}
