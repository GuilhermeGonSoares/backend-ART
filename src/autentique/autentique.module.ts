import { Module } from '@nestjs/common';
import { AutentiqueService } from './autentique.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [ConfigModule, HttpModule, ContractModule],
  providers: [AutentiqueService],
  exports: [AutentiqueService],
})
export class AutentiqueModule {}
