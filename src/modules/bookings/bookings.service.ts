import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import {  GetBookingDto } from './dto/get-booking.dto';
import { In, Repository, ILike } from 'typeorm';
import { Table } from '../tables/entities/table.entity';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
    });
    return this.bookingRepository.save(booking);
  }

  // async findAll(
  //   options?: PaginationOptions,
  // ): Promise<PaginationResult<GetBookingDto[]>> {
  //   const {
  //     page = Math.max(1, Number(options?.page)),
  //     limit = Math.min(Math.max(1, Number(options?.limit)), 100),
  //     filterText = options?.filterText?.trim() || undefined,
  //   } = options || {};

  //   const bookings = this.bookingRepository
  //     .createQueryBuilder('booking')
  //     .select([
  //       'booking.id',
  //       'booking.userId',
  //       'booking.restaurantId',
  //       'booking.name',
  //       'booking.phone',
  //       'booking.email',
  //       'booking.date',
  //       'booking.startTime',
  //       'booking.endTime',
  //       'booking.guests',
  //     ])
  //     .skip((page - 1) * limit)
  //     .take(limit);

  //   const [results, total] = await bookings.getManyAndCount();

  //   return {
  //     results,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async findAllForUser(
    options?: PaginationOptions,
    userId?: number,
  ): Promise<PaginationResult<GetBookingDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filterText = options?.filterText?.trim() || undefined,
    } = options || {};

    const whereCondition = {};

    if (filterText) {
      whereCondition['name'] = ILike(`%${filterText}%`);
    }

    if (userId) {
      whereCondition['userId'] = userId;
    }

    const bookings = this.bookingRepository
      .createQueryBuilder('booking')
      .where(whereCondition)
      .select([
        'booking.id',
        'booking.userId',
        'booking.restaurantId',
        'booking.createAt',
        'booking.date',
        'booking.startTime',
        'booking.endTime',
        'booking.guests',
        'booking.status',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    const [results, total] = await bookings.getManyAndCount();

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllForAdmin(
    options?: PaginationOptions & { restaurantId?: number },
  ): Promise<PaginationResult<GetBookingDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filterText = options?.filterText?.trim() || undefined,
      restaurantId = options?.restaurantId,
    } = options || {};

    const whereCondition = {};

    if (filterText) {
      whereCondition['name'] = ILike(`%${filterText}%`);
    }

    if (restaurantId) {
      whereCondition['restaurantId'] = restaurantId;
    }

    const bookings = this.bookingRepository
      .createQueryBuilder('booking')
      .where(whereCondition)
      .select([
        'booking.id',
        'booking.userId',
        'booking.restaurantId',
        'booking.name',
        'booking.phone',
        'booking.email',
        'booking.createAt',
        'booking.date',
        'booking.startTime',
        'booking.endTime',
        'booking.guests',
        'booking.status',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    const [results, total] = await bookings.getManyAndCount();

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneForUser(id: number) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.restaurant', 'restaurant')
      .where('booking.id = :id', { id })
      .select([
        'booking.id as id',
        'booking.restaurantId as restaurantId',
        'booking.name as name',
        'booking.phone as phone',
        'booking.email as email',
        'booking.date as date',
        'booking.startTime as startTime',
        'booking.endTime as endTime',
        'booking.guests as guests',
        'booking.status as status',
        'restaurant.name as restaurantName',
        'restaurant.address as restaurantAddress',
        'restaurant.phone as restaurantPhone',
      ])
      .getRawOne();

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    // Cập nhật thông tin booking
    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async statusBooking(id: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    booking.status = status;
    
    return await this.bookingRepository.save(booking);
  }

  // async remove(id: number) {
  //   const booking = await this.bookingRepository.findOne({ where: { id } });
  //   if (!booking) {
  //     throw new NotFoundException(`Booking with id ${id} not found`);
  //   }
  //   booking.isDeleted = true;
  //   return await this.bookingRepository.save(booking);
  // }
}
