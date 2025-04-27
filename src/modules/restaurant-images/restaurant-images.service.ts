import { Inject, Injectable } from '@nestjs/common';
import { CreateRestaurantImageDto } from './dto/create-restaurant-image.dto';
import { QueryRunner, Repository } from 'typeorm';
import { RestaurantImage } from './entities/restaurant-image.entity';

@Injectable()
export class RestaurantImagesService {
  constructor(
    @Inject('RESTAURANT_IMAGES_REPOSITORY')
    private restaurantImageRepository: Repository<RestaurantImage>,
  ) {}

  async create(createRestaurantImageDto: CreateRestaurantImageDto) {
    return await this.restaurantImageRepository.save(createRestaurantImageDto);
  }

  async remove(id: number) {
    return await this.restaurantImageRepository.delete(id);
  }

  async createWithRunner(
    queryRunner: QueryRunner,
    createRestaurantImageDto: CreateRestaurantImageDto,
  ) {
    const image = queryRunner.manager.create(
      RestaurantImage,
      createRestaurantImageDto,
    );
    return queryRunner.manager.save(RestaurantImage, image);
  }
}
