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

export class CreateCustomerDto {
  @IsString()
  @Validate(CNPJ)
  cnpj: string;

  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  @Length(2, 2)
  @IsEnum(Uf)
  uf: string;

  @IsString()
  @MaxLength(12)
  mainPhone: string;

  @IsString()
  @MaxLength(12)
  financePhone: string;

  @IsEmail()
  financeEmail: string;

  @IsUrl()
  instagramProfile: string;
}
