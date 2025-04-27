import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { RestaurantImagesService } from './restaurant-images.service';
import { CreateRestaurantImageDto } from './dto/create-restaurant-image.dto';

@Controller('restaurant-images')
export class RestaurantImagesController {
  constructor(
    private readonly restaurantImagesService: RestaurantImagesService,
  ) {}

  // @Post()
  // create(@Body() createRestaurantImageDto: CreateRestaurantImageDto) {
  //   return this.restaurantImagesService.create(createRestaurantImageDto);
  // }
}
