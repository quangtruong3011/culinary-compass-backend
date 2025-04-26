import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { GetBookingDto } from './dto/get-booking.dto';
import { In, Repository, ILike } from 'typeorm';
import { Table } from '../tables/entities/table.entity';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    @Inject('TABLE_REPOSITORY')
    private tableRepository: Repository<Table>,
  ) {}

  async create(CreateBookingDto: CreateBookingDto) {
    const {
      userId,
      restaurantId,
      name,
      phone,
      email,
      date,
      startTime,
      endTime,
      guests,
    } = CreateBookingDto;
    // Tạo booking mới
    const booking = this.bookingRepository.create({
      userId,
      restaurantId,
      name,
      phone,
      email,
      date,
      startTime,
      endTime,
      guests,
    });

    // Lưu booking
    return await this.bookingRepository.save(booking);
  }

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginationResult<GetBookingDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const bookings = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.tables', 'table')
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
        'booking.isConfirmed',
        'booking.isDeleted',
        'table.id',
        'table.name',
        'table.capacity',
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
  async findAllByUserId(
    options?: PaginationOptions & { userId?: number },
  ): Promise<PaginationResult<GetBookingDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
      userId = options?.userId,
    } = options || {};

    const whereCondition = {};

    if (filter) {
      whereCondition['name'] = ILike(`%${filter}%`);
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
        'booking.isConfirmed',
        'booking.isDeleted',
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

  async findOne(id: number): Promise<GetBookingDto> {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.id = :id', { id })
      .select([
        'booking.id',
        'booking.restaurantId',
        'booking.name',
        'booking.phone',
        'booking.email',
        'booking.createAt',
        'booking.date',
        'booking.startTime',
        'booking.endTime',
        'booking.guests',
        'booking.isConfirmed',
        'booking.isDeleted',
      ])
      .getOne();

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

  async confirmBooking(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    booking.isConfirmed = true;
    return await this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    booking.isDeleted = true;
    return await this.bookingRepository.save(booking);
  }
}
