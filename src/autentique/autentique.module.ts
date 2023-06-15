import { Module } from '@nestjs/common';
import { AutentiqueService } from './autentique.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [AutentiqueService],
  exports: [AutentiqueService],
})
export class AutentiqueModule {}
