import { Module } from '@nestjs/common';
import { databaseProviders } from 'src/config/database.config';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
