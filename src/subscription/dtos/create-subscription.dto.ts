import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  discount: number;

  @IsString()
  @IsOptional()
  alocatedDesigner: string;

  @IsString()
  @IsOptional()
  alocatedAds: string;

  @IsNumber()
  @IsOptional()
  extraCosts: number;

  @IsInt()
  preferredDueDate: number;

  @IsString()
  initialDate: string;

  @IsString()
  finishedDate: string;
}
