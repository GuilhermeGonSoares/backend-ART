import {
  IsString,
  Length,
  MaxLength,
  IsEmail,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { Uf } from '../../enums/states.enum';

export class CreateCustomerDto {
  @IsString()
  @Length(14, 14)
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
