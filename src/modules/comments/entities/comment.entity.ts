import { Delete } from '@nestjs/common';
import { Booking } from 'src/modules/bookings/entities/booking.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  bookingId: number;

  @Column({ type: 'nvarchar' })
  content: string;

  @Column({ type: 'bigint' , default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Booking, (booking) => booking.comments)
  booking: Booking;

  @ManyToMany(() => User, (user) => user.comments, { cascade: true })
  @JoinTable({
    name: 'user_comments',
    joinColumn: {
      name: 'commentId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
