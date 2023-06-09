import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargeEntity } from './entities/charge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(ChargeEntity)
    private readonly repository: Repository<ChargeEntity>,
  ) {}
}
