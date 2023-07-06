import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ProductType } from '../../enums/product.enum';

export class CreateAutomationDto {
  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  id: number;

  @IsBoolean()
  isCreateGroup?: boolean;

  @IsBoolean()
  isCreateDrive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAutentique?: boolean;
}
