import { IsString } from 'class-validator';

export class CreateContractTemplateDto {
  @IsString()
  name: string;

  @IsString()
  fileId: string;
}
