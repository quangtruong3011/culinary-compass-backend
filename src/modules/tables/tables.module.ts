import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { tableProviders } from './table.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TablesController],
  providers: [...tableProviders, TablesService],
  exports: [TablesService],
})
export class TablesModule { }
