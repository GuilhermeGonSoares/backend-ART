import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      database: configService.get('DB_DATABASE'),
      host: configService.get('DB_HOST'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      port: Number(configService.get('DB_PORT')),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    TypeOrmConfig.getOrmConfig(configService),
};
