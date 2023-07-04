import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiPropertyOptional({ example: '00.000.000/0000-00' })
  cnpj?: string;

  @ApiPropertyOptional({ example: 'Guilherme' })
  name?: string;

  @ApiPropertyOptional({ example: 'Brasília' })
  city?: string;

  @ApiPropertyOptional({ example: 'DF' })
  uf?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  mainPhone?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  financePhone?: string;

  @ApiPropertyOptional({ example: 'finance@example.com' })
  financeEmail?: string;

  @ApiPropertyOptional({ example: 'https://www.instagram.com/myprofile' })
  instagramProfile?: string;
}
