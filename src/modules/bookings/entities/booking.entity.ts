import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Table } from '../../tables/entities/table.entity';

@Entity('bookings')
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    userId: number;

    @Column({ type: 'bigint' })
    restaurantId: number;

    @Column({ type: 'nvarchar'})
    name: string;

    @Column({ type: 'nvarchar'})
    phone: string;

    @Column({ type: 'nvarchar', nullable: true })
    email: string;

    @Column({ type: 'datetime' })
    date: Date;

    @Column({ type: 'datetime' })
    startTime: Date;

    @Column({ type: 'datetime' })
    endTime: Date;

    @Column({ type: 'bigint'})
    guests: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn({ nullable: true })
    deleteAt: Date;

    @Column({ type: 'nvarchar', default: 'pending' })
    status: string;

    @ManyToMany(() => Table)
    @JoinTable({
        name: 'booking_table', 
        joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'table_id', referencedColumnName: 'id' },
    })
    tables: Table[];
}