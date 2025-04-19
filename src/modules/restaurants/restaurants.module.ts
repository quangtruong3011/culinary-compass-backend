import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { DatabaseModule } from 'src/database/database.module';
import { restaurantProviders } from './restaurant.provider';
import { restaurantImagesProviders } from '../restaurant-images/restaurant-images.provider';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RestaurantImagesModule } from '../restaurant-images/restaurant-images.module';

@Module({
  imports: [DatabaseModule, RestaurantImagesModule, CloudinaryModule],
  controllers: [RestaurantsController],
  providers: [
    ...restaurantProviders,
    ...restaurantImagesProviders,
    RestaurantsService,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
