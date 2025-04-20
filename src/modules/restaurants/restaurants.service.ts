import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ILike, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RestaurantImagesService } from '../restaurant-images/restaurant-images.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { GetAllRestaurantForUserDto } from './dto/get-all-restaurant-for-user.dto';
import { GetAllRestaurantForAdminDto } from './dto/get-all-restaurant-for-admin.dto';
import { GetRestaurantForUserDto } from './dto/get-restaurant-for-user.dto';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @Inject('RESTAURANT_REPOSITORY')
    private restaurantRepository: Repository<Restaurant>,
    private readonly restaurantImagesService: RestaurantImagesService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, userId: number) {
    const newRestaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      ownerId: userId,
      images: [],
    });

    const savedRestaurant = await this.restaurantRepository.save(newRestaurant);

    if (!createRestaurantDto.images?.length) {
      return savedRestaurant;
    }

    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const imageUploadResults = await Promise.all(
      createRestaurantDto.images.map(async (file) => {
        const tempFilePath = path.join(tempDir, `${uuidv4()}.jpg`);
        const base64Data = file.replace(/^data:image\/jpeg;base64,/, '');

        try {
          await fs.promises.writeFile(tempFilePath, base64Data, 'base64');
          const result =
            await this.cloudinaryService.uploadLocalFile(tempFilePath);
          await unlink(tempFilePath);
          return result;
        } catch (error) {
          console.error('Error uploading image:', error);
          await unlink(tempFilePath).catch(() => {});
          throw new BadRequestException('Invalid file type');
        }
      }),
    );

    const imageEntities = imageUploadResults.map((result, index) =>
      this.restaurantImagesService.create({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        restaurantId: savedRestaurant.id,
        isMain: index === 0,
      }),
    );

    await Promise.all(imageEntities);

    return savedRestaurant;
  }

  async findAllRestaurantForAdmin(
    options: PaginationOptions,
    userId: number,
  ): Promise<PaginationResult<GetAllRestaurantForAdminDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const [restaurants, total] = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect(
        'restaurant.images',
        'image',
        'image.isMain = :isMain',
        { isMain: true },
      )
      .where('restaurant.ownerId = :userId', { userId })
      .andWhere(
        filter ? 'restaurant.name ILIKE :filter' : '1=1',
        filter ? { filter: `%${filter}%` } : {},
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const results = restaurants.map((restaurant) => {
      return {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime,
        imageUrl: restaurant.images?.[0]?.imageUrl || '',
      };
    });

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllRestaurantForUser(
    options: PaginationOptions,
  ): Promise<PaginationResult<GetAllRestaurantForUserDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const [restaurants, total] = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect(
        'restaurant.images',
        'image',
        'image.isMain = :isMain',
        { isMain: true },
      )
      .where(filter ? 'restaurant.name ILIKE :filter' : '1=1', {
        filter: `%${filter}%`,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const results = restaurants.map((restaurant) => {
      return {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime,
        imageUrl: restaurant.images?.[0]?.imageUrl || '',
      };
    });

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneRestaurnForAdmin(id: number) {
    const restaurant = await this.restaurantRepository.findOneBy({ id });
    if (!restaurant) return new NotFoundException('Restaurant not found');

    return restaurant;
  }

  async findOneRestaurantForUser(id: number): Promise<GetRestaurantForUserDto> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      imageUrl: restaurant.images.map((image) => image.imageUrl),
    };
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepository.findOneBy({ id });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const { images, ...rest } = updateRestaurantDto;
    const updatedRestaurant = this.restaurantRepository.merge(restaurant, {
      ...rest,
      images:
        images?.map((image) => ({ imageUrl: image })) || restaurant.images,
    });

    return await this.restaurantRepository.save(updatedRestaurant);
  }

  async remove(id: number, userId: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, ownerId: userId },
      relations: ['images'],
    });
    if (!restaurant) {
      return new NotFoundException('Restaurant not found');
    }
    await this.restaurantRepository.softDelete(id);
  }
}
