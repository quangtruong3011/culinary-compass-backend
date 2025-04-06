import { Inject, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @Inject('RESTAURANT_REPOSITORY')
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, userId: number) {
    // const restaurant = this.restaurantRepository.create(createRestaurantDto);
    // return await this.restaurantRepository.save(restaurant);
    return `${userId} created a restaurant`;
  }

  async findAll() {
    return `This action returns all restaurants`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  async remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
