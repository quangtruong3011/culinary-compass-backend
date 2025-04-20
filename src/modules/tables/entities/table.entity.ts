import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('tables')
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  restaurantId: number;

  @Column({ type: 'nvarchar', length: 256 })
  name: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'bit', default: true })
  isAvailable: boolean;

  @ManyToMany(() => Booking, (booking) => booking.tables)
    bookings: Booking[];
}
