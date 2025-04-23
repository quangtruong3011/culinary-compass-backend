import { RestaurantImage } from 'src/modules/restaurant-images/entities/restaurant-image.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  province: string;

  @Column({ type: 'nvarchar', length: 256 })
  district: string;

  @Column({ type: 'nvarchar', length: 256 })
  ward: string;

  @Column({ type: 'nvarchar', length: 12 })
  phone: string;

  @Column({ type: 'nvarchar', length: 1024 })
  description: string;

  @Column({ type: 'nvarchar', length: 256, nullable: true })
  website: string;

  @Column({ type: 'nvarchar' })
  openingTime: Date;

  @Column({ type: 'nvarchar' })
  closingTime: Date;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(
    () => RestaurantImage,
    (restaurantImage) => restaurantImage.restaurant,
    { eager: true },
  )
  images: RestaurantImage[];
}
