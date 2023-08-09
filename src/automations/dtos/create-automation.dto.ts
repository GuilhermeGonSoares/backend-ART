import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { ProductType } from '../../enums/product.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateLaterThanToday } from '../../utils/validates/date.validation';

export class CreateAutomationDto {
  @ApiProperty({ enum: ProductType, description: 'The type of product' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 123, description: 'The ID' })
  @IsNumber()
  id: number;

  @IsDateString()
  @Validate(IsDateLaterThanToday)
  @IsOptional()
  initialDate?: string;

  @ApiProperty({ example: true, description: 'Flag to create group' })
  @IsBoolean()
  @IsOptional()
  isCreateGroup?: boolean;

  @ApiProperty({ example: true, description: 'Flag to create drive' })
  @IsBoolean()
  @IsOptional()
  isCreateDrive?: boolean;

  @ApiProperty({ example: true, description: 'Flag for Autentique' })
  @IsBoolean()
  @IsOptional()
  isAutentique?: boolean;
}
