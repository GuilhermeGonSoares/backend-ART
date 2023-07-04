import { PartialType } from '@nestjs/mapped-types';
import { CreateContractTemplateDto } from './create-contract.dto';

export class UpdateContractTemplateDto extends PartialType(
  CreateContractTemplateDto,
) {}
