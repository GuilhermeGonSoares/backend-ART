import { Module } from '@nestjs/common';
import { AsaasService } from './asaas.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AsaasService],
  exports: [AsaasService],
})
export class AsaasModule {}
