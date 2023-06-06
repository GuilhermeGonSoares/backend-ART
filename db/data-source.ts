import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import TypeOrmConfig from '../src/config/database';

config();
const configService = new ConfigService();

export default new DataSource(
  TypeOrmConfig.getOrmConfig(configService) as DataSourceOptions,
);
