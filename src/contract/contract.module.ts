import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { MulterModule } from '@nestjs/platform-express';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
    GoogleDriveModule,
    HttpModule,
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
