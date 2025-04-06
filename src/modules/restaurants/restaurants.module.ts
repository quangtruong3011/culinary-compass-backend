import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { DatabaseModule } from 'src/database/database.module';
import { restaurantProviders } from './restaurant.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RestaurantsController],
  providers: [...restaurantProviders, RestaurantsService],
})
export class RestaurantsModule {}
