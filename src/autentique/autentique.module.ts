import { Module } from '@nestjs/common';
import { AutentiqueService } from './autentique.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ContractModule } from '../contract/contract.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutentiqueEntity } from './entities/autentique.entity';
import { GoogleDriveModule } from '../google-drive/google-drive.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutentiqueEntity]),
    ConfigModule,
    HttpModule,
    ContractModule,
    GoogleDriveModule,
  ],
  providers: [AutentiqueService],
  exports: [AutentiqueService],
})
export class AutentiqueModule {}
