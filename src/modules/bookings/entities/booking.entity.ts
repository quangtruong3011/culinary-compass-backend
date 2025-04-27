import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('bookings')
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'bigint' })
  restaurantId: number;

  @Column({ type: 'nvarchar' })
  name: string;

  @Column({ type: 'nvarchar' })
  phone: string;

  @Column({ type: 'nvarchar', nullable: true })
  email: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'bigint' })
  guests: number;

  @CreateDateColumn()
  createAt: Date;

  @Column({ type: 'bit', default: false })
  isConfirmed: boolean;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn({ nullable: true })
  deleteAt: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.bookings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  restaurant: Restaurant;
}
