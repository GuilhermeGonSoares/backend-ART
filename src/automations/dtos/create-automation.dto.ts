import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ProductType } from '../../enums/product.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAutomationDto {
  @ApiProperty({ enum: ProductType, description: 'The type of product' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 123, description: 'The ID' })
  @IsNumber()
  id: number;

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
