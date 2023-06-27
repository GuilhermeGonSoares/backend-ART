import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ProductType } from '../../enums/product.enum';

export class CreateAutomationDto {
  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  customerId: string;

  @IsBoolean()
  isCreateGroup?: boolean;

  @IsBoolean()
  isCreateDrive?: boolean;

  @IsBoolean()
  isAutentique?: boolean;
}
