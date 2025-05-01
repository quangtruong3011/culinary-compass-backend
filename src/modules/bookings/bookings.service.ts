import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { GetBookingDto } from './dto/get-booking.dto';
import {
  In,
  Repository,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { Table } from '../tables/entities/table.entity';
import { BookingStatusDto } from './dto/booking-status.dto';
import { GetTableDto } from '../tables/dto/get-table.dto';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    @Inject('TABLE_REPOSITORY')
    private tableRepository: Repository<Table>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
    });
    return this.bookingRepository.save(booking);
  }

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

  async findOneForAdmin(id: number) {
    const rawBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.restaurant', 'restaurant')
      .leftJoin('booking.tables', 'table')
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

        'table.id as tableId',
        'table.name as tableName',
        'table.numberOfSeats as tableSeats',
      ])
      .getRawMany();

    if (!rawBooking || rawBooking.length === 0) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const bookingInfo = {
      id: rawBooking[0].id,
      restaurantId: rawBooking[0].restaurantId,
      name: rawBooking[0].name,
      phone: rawBooking[0].phone,
      email: rawBooking[0].email,
      date: rawBooking[0].date,
      startTime: rawBooking[0].startTime,
      endTime: rawBooking[0].endTime,
      guests: rawBooking[0].guests,
      status: rawBooking[0].status,
      restaurant: {
        name: rawBooking[0].restaurantName,
        address: rawBooking[0].restaurantAddress,
        phone: rawBooking[0].restaurantPhone,
      },
      tables: rawBooking
        .filter((r) => r.tableId !== null)
        .map((r) => ({
          id: r.tableId,
          name: r.tableName,
          numberOfSeats: r.tableSeats,
        })),
    };

    return bookingInfo;
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

  async updateStatusBooking(id: number, status: BookingStatusDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    booking.status = status;

    await this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return await this.bookingRepository.save(booking);
  }

  async assignTablesToBooking(
    bookingId: number,
    tableIds: number[],
  ): Promise<Booking> {
    // 1. Tìm booking và kiểm tra tồn tại
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['tables', 'restaurant'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    // 2. Kiểm tra tất cả bàn tồn tại và thuộc đúng nhà hàng
    const tables = await this.tableRepository.find({
      where: { id: In(tableIds), restaurantId: booking.restaurant.id },
    });

    if (tables.length !== tableIds.length) {
      const foundIds = tables.map((t) => t.id);
      const missingIds = tableIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Tables with IDs [${missingIds.join(', ')}] not found in restaurant ${booking.restaurant.id}`,
      );
    }

    // 3. Kiểm tra xung đột lịch đặt bàn
    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('booking.tables', 'table')
      .where('table.id IN (:...tableIds)', { tableIds })
      .andWhere('booking.id != :bookingId', { bookingId })
      .andWhere('booking.status NOT IN (:...inactiveStatuses)', {
        inactiveStatuses: ['cancelled', 'completed'],
      })
      .andWhere(
        `(
          (booking.startTime < :endTime AND booking.endTime > :startTime) OR
          (booking.startTime <= :startTime AND booking.endTime >= :endTime)
        )`,
        {
          startTime: booking.startTime,
          endTime: booking.endTime,
        },
      )
      .getMany();

    if (conflictingBookings.length > 0) {
      const conflictingTableIds = [
        ...new Set(
          conflictingBookings.flatMap((b) => b.tables.map((t) => t.id)),
        ),
      ];
      const conflictingTables = tables.filter((t) =>
        conflictingTableIds.includes(t.id),
      );

      throw new NotFoundException(
        `Tables [${conflictingTables.map((t) => t.name).join(', ')}] are already booked during this time period. Conflicting booking IDs: [${conflictingBookings.map((b) => b.id).join(', ')}]`,
      );
    }

    // 4. Chỉ gán bàn vào booking, KHÔNG set trạng thái 'occupied' ở đây
    booking.tables = tables;
    return await this.bookingRepository.save(booking);
  }

  async availableTable(
    restaurantId: number,
    date: Date,
    startTime: Date,
    endTime: Date,
  ): Promise<GetTableDto[]> {
    // // Lấy tất cả bàn của nhà hàng
    // const tables = await this.tableRepository.find({
    //   where: { restaurantId },
    // });

    // const unavailableTables: GetTableDto[] = [];

    // // Duyệt qua từng bàn để kiểm tra trạng thái
    // for (const table of tables) {
    //   // Tìm các booking có liên quan đến bàn này trong khoảng thời gian yêu cầu
    //   const bookings = await this.bookingRepository.find({
    //     where: {
    //       restaurantId,
    //       date,
    //       startTime: LessThanOrEqual(endTime),
    //       endTime: MoreThanOrEqual(startTime),
    //     },
    //     relations: ['tables'],
    //   });

    //   // Nếu có booking liên quan đến bàn này, đánh dấu nó là không có sẵn (unavailable)
    //   if (bookings.some((booking) => booking.tables.includes(table))) {
    //     table.status = 'reserved'; // Bàn đã được đặt
    //     unavailableTables.push(table);
    //   } else {
    //     table.status = 'available'; // Bàn còn trống
    //   }
    // }

    // // Trả về các bàn không bị đặt (chưa có trong unavailableTables)
    // return tables.filter((table) => !unavailableTables.includes(table));

    const tables = await this.tableRepository.find({ where: { restaurantId } });

    // Tìm tất cả booking liên quan trong khoảng thời gian
    const bookings = await this.bookingRepository.find({
      where: {
        restaurantId,
        date,
        startTime: LessThanOrEqual(endTime),
        endTime: MoreThanOrEqual(startTime),
      },
      relations: ['tables'],
    });

    // Lấy tất cả bàn đã được đặt từ các booking
    const bookedTableIds = bookings.flatMap((booking) =>
      booking.tables.map((table) => table.id),
    );

    // Đánh dấu trạng thái và lọc bàn
    return tables
      .map((table) => {
        table.status = bookedTableIds.includes(table.id)
          ? 'reserved'
          : 'available';
        return table;
      })
      .filter((table) => table.status === 'available');
  }
}
