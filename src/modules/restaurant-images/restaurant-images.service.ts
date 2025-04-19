import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantImageDto } from './dto/create-restaurant-image.dto';
import { UpdateRestaurantImageDto } from './dto/update-restaurant-image.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { RestaurantImage } from './entities/restaurant-image.entity';

@Injectable()
export class RestaurantImagesService {
  constructor(
    @Inject('RESTAURANT_IMAGES_REPOSITORY')
    private restaurantImageRepository: Repository<RestaurantImage>,
  ) {}

  create(createRestaurantImageDto: CreateRestaurantImageDto) {
    return this.restaurantImageRepository.save(createRestaurantImageDto);
  }

  findAll() {
    return `This action returns all restaurantImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantImage`;
  }

  update(id: number, updateRestaurantImageDto: UpdateRestaurantImageDto) {
    return `This action updates a #${id} restaurantImage`;
  }

  async remove(id: number) {
    const restaurantImage = await this.restaurantImageRepository.findOne({
      where: { id },
    });
    if (!restaurantImage) {
      throw new NotFoundException('Restaurant image not found');
    }
    // await this.cloudinaryService.deleteImage(restaurantImage.publicId);
    await this.restaurantImageRepository.delete(id);
  }
}
