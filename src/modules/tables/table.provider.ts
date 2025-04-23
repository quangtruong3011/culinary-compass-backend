import { DataSource } from 'typeorm';
import { Table } from './entities/table.entity';

export const tableProviders = [
  {
    provide: 'TABLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Table),
    inject: ['DATA_SOURCE'],
  },
];
