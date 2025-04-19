import { RestaurantImage } from './entities/restaurant-image.entity';

export const restaurantImagesProviders = [
  {
    provide: 'RESTAURANT_IMAGES_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository(RestaurantImage),
    inject: ['DATA_SOURCE'],
  },
];
