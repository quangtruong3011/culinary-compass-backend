import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantImageDto } from './create-restaurant-image.dto';

export class UpdateRestaurantImageDto extends PartialType(CreateRestaurantImageDto) {}
