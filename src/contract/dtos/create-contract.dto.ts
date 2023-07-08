import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractTemplateDto {
  @ApiProperty({
    example: 'Template 1',
    description: 'The name of the contract template',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'abc123',
    description: 'The file ID of the contract template',
  })
  @IsString()
  fileId: string;
}
