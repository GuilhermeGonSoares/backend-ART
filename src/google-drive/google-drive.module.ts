import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleDriveEntity } from './entities/google-drive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleDriveEntity]), HttpModule],
  providers: [GoogleDriveService],
  exports: [GoogleDriveService],
})
export class GoogleDriveModule {}
