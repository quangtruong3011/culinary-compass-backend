import { Module } from '@nestjs/common';
import { RestaurantImagesService } from './restaurant-images.service';
import { RestaurantImagesController } from './restaurant-images.controller';
import { restaurantImagesProviders } from './restaurant-images.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RestaurantImagesController],
  providers: [...restaurantImagesProviders, RestaurantImagesService],
  exports: [RestaurantImagesService],
})
export class RestaurantImagesModule {}
