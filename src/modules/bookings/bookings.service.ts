import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { GetBookingDto } from './dto/get-booking.dto';
import { In, Repository } from 'typeorm';
import { Table } from '../tables/entities/table.entity';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    @Inject('TABLE_REPOSITORY')
    private tableRepository: Repository<Table>,
  ) {}

  //   async create(CreateBookingDto: CreateBookingDto) {
  //     const { userId, people, timeBooking, tableIds } = CreateBookingDto;

  //     // Kiểm tra timeBooking phải sau thời gian hiện tại
  //     const currentTime = new Date();
  //     if (new Date(timeBooking) <= currentTime) {
  //       throw new NotFoundException('timeBooking must be in the future');
  //     }

  //     // Lấy danh sách bàn theo tableIds
  //     const tables = await this.tableRepository.findBy({ id: In(tableIds) });
  //     if (tables.length !== tableIds.length) {
  //       throw new NotFoundException('Some tables not found');
  //     }

  //     // Tính tổng capacity của các bàn
  //     const totalCapacity = tables.reduce(
  //       (sum, table) => sum + table.capacity,
  //       0,
  //     );

  //     // Kiểm tra tổng capacity có đủ cho số người không
  //     if (totalCapacity < people) {
  //       throw new NotFoundException(
  //         `Total capacity of selected tables (${totalCapacity}) is less than the number of people (${people})`,
  //       );
  //     }

  //     // Kiểm tra số người phải lớn hơn 0
  //     if (people < 1) {
  //       throw new NotFoundException('People must be greater than 0');
  //     }

  //     // Tạo booking mới
  //     const booking = this.bookingRepository.create({
  //       userId,
  //       people,
  //       timeBooking,
  //       tables,
  //     });

  //     // Lưu booking
  //     return await this.bookingRepository.save(booking);
  //   }

  //   async findAll(
  //     options?: PaginationOptions,
  //   ): Promise<PaginationResult<GetBookingDto[]>> {
  //     const {
  //       page = Math.max(1, Number(options?.page)),
  //       limit = Math.min(Math.max(1, Number(options?.limit)), 100),
  //       filter = options?.filter?.trim() || undefined,
  //     } = options || {};

  //     const bookings = this.bookingRepository
  //       .createQueryBuilder('booking')
  //       .leftJoinAndSelect('booking.tables', 'table')
  //       .select([
  //         'booking.id',
  //         'booking.userId',
  //         'booking.timeBooking',
  //         'booking.timeCreate',
  //         'booking.people',
  //         'table.id',
  //         'table.name',
  //         'table.capacity',
  //       ])
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     const [results, total] = await bookings.getManyAndCount();

  //     return {
  //       results,
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     };
  //   }
  //   async findAllByUserId(
  //     userId: number,
  //     options?: PaginationOptions,
  //   ): Promise<PaginationResult<GetBookingDto[]>> {
  //     const {
  //       page = Math.max(1, Number(options?.page)),
  //       limit = Math.min(Math.max(1, Number(options?.limit)), 100),
  //       filter = options?.filter?.trim() || undefined,
  //     } = options || {};

  //     const bookings = this.bookingRepository
  //       .createQueryBuilder('booking')
  //       .leftJoinAndSelect('booking.tables', 'table')
  //       .where('booking.userId = :userId', { userId })
  //       .select([
  //         'booking.id',
  //         'booking.userId',
  //         'booking.timeBooking',
  //         'booking.timeCreate',
  //         'booking.people',
  //         'table.id',
  //         'table.name',
  //         'table.capacity',
  //       ])
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     const [results, total] = await bookings.getManyAndCount();

  //     return {
  //       results,
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     };
  //   }

  //   async findOne(id: number): Promise<GetBookingDto> {
  //     const booking = await this.bookingRepository
  //       .createQueryBuilder('booking')
  //       .leftJoinAndSelect('booking.tables', 'table')
  //       .where('booking.id = :id', { id })
  //       .select([
  //         'booking.id',
  //         'booking.userId',
  //         'booking.timeBooking',
  //         'booking.timeCreate',
  //         'booking.people',
  //         'table.id',
  //         'table.name',
  //         'table.capacity',
  //       ])
  //       .getOne();

  //     if (!booking) {
  //       throw new NotFoundException(`Booking with id ${id} not found`);
  //     }

  //     return booking;
  //   }

  //   async remove(id: number) {
  //     const booking = await this.bookingRepository.findOne({ where: { id } });
  //     if (!booking) {
  //       throw new NotFoundException(`Booking with id ${id} not found`);
  //     }
  //     await this.bookingRepository.remove(booking);
  //   }
}
