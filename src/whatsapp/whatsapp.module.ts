import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappEntity } from './entities/whatsapp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsappEntity]), HttpModule],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
