import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { IsDateLaterThan } from '../../utils/validates/finish-date.validation';
import { SubscriptionStatus } from '../../enums/subscription-status.enum';

export class CreateSubscriptionDto {
  @IsString()
  customerId: string;

  @IsInt()
  productId: number;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status: SubscriptionStatus;

  @IsNumber()
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
