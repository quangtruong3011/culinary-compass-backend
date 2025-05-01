import { Booking } from 'src/modules/bookings/entities/booking.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('tables')
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  restaurantId: number;

  @Column({ type: 'nvarchar', length: 256 })
  name: string;

  @Column({ type: 'int' })
  numberOfSeats: number;

  @Column({
    type: 'nvarchar',
    enum: {
      available: 'available',
      unavailable: 'unavailable',
      occupied: 'occupied',
    },
    default: 'available',
  })
  status: string;

  async getCurrentStatus(): Promise<'available' | 'occupied' | 'unavailable'> {
    if (this.status === 'unavailable') {
      return 'unavailable'; // Bàn bị khóa
    }

    // Kiểm tra xem có booking nào đang diễn ra không
    const activeBooking = await this.bookings.find(
      (booking) =>
        booking.status === 'confirmed' &&
        new Date() >= booking.startTime &&
        new Date() <= booking.endTime,
    );

    return activeBooking ? 'occupied' : 'available';
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Booking, (booking) => booking.tables, {
    cascade: true,
  })
  @JoinTable({
    name: 'table_bookings',
    joinColumn: { name: 'tableId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'bookingId', referencedColumnName: 'id' },
  })
  bookings: Booking[];
}
