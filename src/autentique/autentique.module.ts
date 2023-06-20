import { Module } from '@nestjs/common';
import { AutentiqueService } from './autentique.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ContractModule } from '../contract/contract.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutentiqueEntity } from './entities/autentique.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutentiqueEntity]),
    ConfigModule,
    HttpModule,
    ContractModule,
  ],
  providers: [AutentiqueService],
  exports: [AutentiqueService],
})
export class AutentiqueModule {}
