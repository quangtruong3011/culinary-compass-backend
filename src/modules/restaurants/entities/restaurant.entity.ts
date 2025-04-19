import { RestaurantImage } from 'src/modules/restaurant-images/entities/restaurant-image.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({ type: 'nvarchar', length: 11 })
  phone: string;

  @Column({ type: 'nvarchar', length: 256, nullable: true })
  website: string;

  @Column({ type: 'nvarchar' })
  openingTime: Date;

  @Column({ type: 'nvarchar' })
  closingTime: Date;

  @OneToMany(
    () => RestaurantImage,
    (restaurantImage) => restaurantImage.restaurant,
    { eager: true },
  )
  images: RestaurantImage[];
}
