import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { Table } from '../../tables/entities/table.entity';

@Entity('bookings')
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    userId: number;

    @CreateDateColumn({ type: 'datetime' })
    timeCreate: Date;

    @Column({ type: 'int'})
    people: number;

    @Column({ type: 'datetime' })
    timeBooking: Date;

    @ManyToMany(() => Table)
    @JoinTable({
        name: 'booking_table', 
        joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'table_id', referencedColumnName: 'id' },
    })
    tables: Table[];
}