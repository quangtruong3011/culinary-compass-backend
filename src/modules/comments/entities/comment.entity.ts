import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    restaurantId: number;

    @Column({ type: 'nvarchar' })
    content: string;
}