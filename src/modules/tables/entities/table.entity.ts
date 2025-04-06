import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tables')
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  restaurantId: number;

  @Column({ type: 'nvarchar', length: 256 })
  name: string;

  @Column({ type: 'int', length: 256 })
  capacity: number;

  @Column({ type: 'bit', length: 256 })
  isAvailable: boolean;
}
