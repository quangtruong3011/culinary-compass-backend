import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurants')
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  ownerId: number;

  @Column({ type: 'nvarchar', length: 512 })
  name: string;

  @Column({ type: 'nvarchar', length: 256 })
  address: string;

  @Column({ type: 'nvarchar', length: 256 })
  city: string;

  @Column({ type: 'nvarchar', length: 256 })
  state: string;

  @Column({ type: 'nvarchar', length: 256 })
  country: string;

  @Column({ type: 'nvarchar', length: 10 })
  phone: string;

  @Column({ type: 'nvarchar', length: 256 })
  website: string;

  @Column({ type: 'nvarchar' })
  openingTime: Date;

  @Column({ type: 'nvarchar' })
  closeingTime: Date;
}
