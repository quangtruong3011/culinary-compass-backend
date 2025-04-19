import { Restaurant } from 'src/modules/restaurants/entities/restaurant.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('restaurant_images')
export class RestaurantImage extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  restaurantId: number;

  @Column({ type: 'nvarchar', length: 'MAX' })
  imageUrl: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  publicId: string;

  @Column({ type: 'bit', default: false })
  isMain: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.images, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant[];
}
