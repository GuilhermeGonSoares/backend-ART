import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { IsDateLaterThan } from '../../utils/validates/finish-date.validation';

export class CreateSubscriptionDto {
  @IsString()
  customerId: string;

  @IsInt()
  productId: number;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount: number;

  @IsString()
  @IsOptional()
  alocatedDesigner: string;

  @IsString()
  @IsOptional()
  alocatedAds: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  extraCosts: number;

  @IsInt()
  @Max(28)
  preferredDueDate: number;

  @IsDateString()
  initialDate: string;

  @IsDateString()
  @Validate(IsDateLaterThan)
  finishedDate: string;

  @IsBoolean()
  @IsOptional()
  isCreateGroup?: boolean;

  @IsBoolean()
  @IsOptional()
  isCreateDrive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAutentique?: boolean;
}
