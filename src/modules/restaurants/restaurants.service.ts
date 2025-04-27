import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { DataSource, ILike, Repository } from 'typeorm';
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
import { GetRestauntDto } from './dto/get-restaurant.dto';

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
        const base64Data = file.imageUrl.replace(
          /^data:image\/jpeg;base64,/,
          '',
        );

        try {
          await fs.promises.writeFile(tempFilePath, base64Data, 'base64');
          const result =
            await this.cloudinaryService.uploadLocalFile(tempFilePath);
          await promisify(fs.unlink)(tempFilePath);
          return result;
        } catch (error) {
          console.error('Error uploading image:', error);
          await promisify(fs.unlink)(tempFilePath).catch(() => {});
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
      filterText = options?.filterText?.trim() || undefined,
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
        filterText ? 'restaurant.name ILIKE :filter' : '1=1',
        filterText ? { filterText: `%${filterText}%` } : {},
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
      filterText = options?.filterText?.trim() || undefined,
    } = options || {};

    const [restaurants, total] = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect(
        'restaurant.images',
        'image',
        'image.isMain = :isMain',
        { isMain: true },
      )
      .where(
        filterText ? 'LOWER(restaurant.name) LIKE LOWER(:filter)' : '1=1',
        filterText ? { filter: `%${filterText}%` } : {},
      )
      .orderBy('restaurant.id', 'ASC')
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

    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      province: restaurant.province,
      district: restaurant.district,
      ward: restaurant.ward,
      phone: restaurant.phone,
      description: restaurant.description,
      website: restaurant.website,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      images: restaurant.images.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        publicId: image.publicId,
      })),
      ownerId: restaurant.ownerId,
    };
  }

  async findOneRestaurantForUser(id: number): Promise<GetRestauntDto> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      province: restaurant.province,
      district: restaurant.district,
      ward: restaurant.ward,
      phone: restaurant.phone,
      description: restaurant.description,
      website: restaurant.website,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      images: restaurant.images.map((image) => image.imageUrl),
    };
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    // const restaurant = await this.restaurantRepository.findOneBy({ id });
    // if (!restaurant) throw new NotFoundException('Restaurant not found');

    // const tempDir = path.join(__dirname, '..', '..', 'temp');
    // if (!fs.existsSync(tempDir)) {
    //   fs.mkdirSync(tempDir, { recursive: true });
    // }

    // // Xóa ảnh cũ nếu có publicId
    // if (updateRestaurantDto.deletedImages) {
    //   for (const image of updateRestaurantDto.deletedImages) {
    //     const { publicId, id } = image;
    //     if (publicId) {
    //       await this.cloudinaryService.deleteFile(publicId);
    //       await this.restaurantImagesService.remove(id);
    //     }
    //   }
    // }

    // if (updateRestaurantDto.images && updateRestaurantDto.images.length > 0) {
    //   for (const image of updateRestaurantDto.images) {
    //     const { imageUrl, publicId } = image;

    //     // Chỉ upload ảnh mới chưa có publicId
    //     if (!publicId && imageUrl.startsWith('data:image/')) {
    //       const tempFilePath = path.join(tempDir, `${uuidv4()}.jpg`);
    //       const base64Data = imageUrl.replace(/^data:image\/jpeg;base64,/, '');

    //       try {
    //         await fs.promises.writeFile(tempFilePath, base64Data, 'base64');

    //         const result =
    //           await this.cloudinaryService.uploadLocalFile(tempFilePath);

    //         await promisify(fs.unlink)(tempFilePath);

    //         // Tạo bản ghi mới cho ảnh mới upload
    //         await this.restaurantImagesService.create({
    //           imageUrl: result.secure_url,
    //           publicId: result.public_id,
    //           restaurantId: restaurant.id,
    //           isMain: false,
    //         });
    //       } catch (error) {
    //         console.error('Error uploading image:', error);
    //         await promisify(fs.unlink)(tempFilePath).catch(() => {});
    //         throw new BadRequestException('Invalid file type');
    //       }
    //     }
    //   }
    // }

    // const updatedRestaurant = this.restaurantRepository.merge(
    //   restaurant,
    //   updateRestaurantDto,
    // );

    // await this.restaurantRepository.save(updatedRestaurant);

    // return {
    //   id: updatedRestaurant.id,
    //   name: updatedRestaurant.name,
    //   address: updatedRestaurant.address,
    //   province: updatedRestaurant.province,
    //   district: updatedRestaurant.district,
    //   ward: updatedRestaurant.ward,
    //   phone: updatedRestaurant.phone,
    //   description: updatedRestaurant.description,
    //   website: updatedRestaurant.website,
    //   openingTime: updatedRestaurant.openingTime,
    //   closingTime: updatedRestaurant.closingTime,
    //   images: updatedRestaurant.images.map((image) => ({
    //     imageUrl: image.imageUrl,
    //     publicId: image.publicId,
    //   })),
    // };

    return console.log('updateRestaurantDto', updateRestaurantDto);
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

  private removeAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
