import { DataSource } from 'typeorm';
import * as path from 'path';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { Booking } from 'src/modules/bookings/entities/booking.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [
          // __dirname + '/../modules/entities/*.entity{.ts,.js}',
          // path.join(__dirname, '..', 'modules', 'entities', '*.entity{.ts,.js}'),
          User,
          Role,
          Restaurant,
          Table,
          Booking
        ],
        synchronize: process.env.NODE_ENV === 'development', // Set to false in production
        logging: process.env.NODE_ENV === 'development',
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
        extra: {
          trustServerCertificate: true,
        },
      });

      return dataSource.initialize();
    },
  },
];
