import {
  IsString,
  Length,
  MaxLength,
  IsEmail,
  IsUrl,
  IsEnum,
  Validate,
} from 'class-validator';
import { Uf } from '../../enums/states.enum';
import { CNPJ } from '../../utils/validates/cnpj.validation';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: '00.000.000/0000-00' })
  @IsString()
  @Validate(CNPJ)
  cnpj: string;

  @ApiProperty({ example: 'Guilherme' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Brasília' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'DF' })
  @IsString()
  @Length(2, 2)
  @IsEnum(Uf)
  uf: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @MaxLength(12)
  mainPhone: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @MaxLength(12)
  financePhone: string;

  @ApiProperty({ example: 'finance@example.com' })
  @IsEmail()
  financeEmail: string;

  @ApiProperty({ example: 'https://www.instagram.com/myprofile' })
  @IsUrl()
  instagramProfile: string;
}
