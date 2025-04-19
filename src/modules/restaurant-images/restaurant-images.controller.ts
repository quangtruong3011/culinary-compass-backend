import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantImagesService } from './restaurant-images.service';
import { CreateRestaurantImageDto } from './dto/create-restaurant-image.dto';
import { UpdateRestaurantImageDto } from './dto/update-restaurant-image.dto';

@Controller('restaurant-images')
export class RestaurantImagesController {
  constructor(private readonly restaurantImagesService: RestaurantImagesService) {}

  @Post()
  create(@Body() createRestaurantImageDto: CreateRestaurantImageDto) {
    return this.restaurantImagesService.create(createRestaurantImageDto);
  }

  @Get()
  findAll() {
    return this.restaurantImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantImageDto: UpdateRestaurantImageDto) {
    return this.restaurantImagesService.update(+id, updateRestaurantImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantImagesService.remove(+id);
  }
}
