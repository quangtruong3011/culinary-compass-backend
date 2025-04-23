import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { GetTableDto } from './dto/get-table.dto';
import { ILike, Repository, Between, Not } from 'typeorm';


@Injectable()
export class TablesService {
  constructor(
    @Inject('TABLE_REPOSITORY')
    private tableRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto) {
    const existingTable = await this.tableRepository.findOne({
      where: {
        name: createTableDto.name,
        restaurantId: createTableDto.restaurantId,
      },
    });
    if (existingTable) {
      throw new NotFoundException(
        `Table with name ${createTableDto.name} already exists`,
      );
    }
    if (createTableDto.capacity < 1) {
      throw new NotFoundException(`Table capacity must be greater than 0`);
    }

    return await this.tableRepository.save(createTableDto);
  }

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginationResult<GetTableDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const [tables, total] = await this.tableRepository.findAndCount({
      where: filter ? { name: ILike(`${filter}`) } : {},
      skip: (page - 1) * limit,
      take: limit,
    });

    const results = tables.map((table) => {
      const { id, name, restaurantId, capacity} = table;
      return { id, name, restaurantId, capacity };
    });

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllByRestaurant(
    restaurantId: number,
    options?: PaginationOptions,
  ): Promise<PaginationResult<GetTableDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const [tables, total] = await this.tableRepository.findAndCount({
      where: filter
        ? { name: ILike(`${filter}`), restaurantId }
        : { restaurantId },
      skip: (page - 1) * limit,
      take: limit,
    });

    const results = tables.map((table) => {
      const { id, name, restaurantId, capacity } = table;
      return { id, name, restaurantId, capacity };
    });

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAvailableTables(restaurantId: number,timeBooking?: Date, options?: PaginationOptions): Promise<PaginationResult<GetTableDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filter = options?.filter?.trim() || undefined,
    } = options || {};

    const queryBuilder = this.tableRepository.createQueryBuilder('table')
      .leftJoin('booking_table', 'bt', 'bt.table_id = table.id')
      .leftJoin('bookings', 'booking', 'booking.id = bt.booking_id')
      .where('table.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('table.restaurantId = :restaurantId', { restaurantId });
  
    if (timeBooking) {
      const startOfDay = new Date(timeBooking);
      startOfDay.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
  
      const endOfDay = new Date(timeBooking);
      endOfDay.setHours(23, 59, 59, 999); // Đặt thời gian về cuối ngày
  
      queryBuilder.andWhere(
        `(booking.timeBooking IS NULL OR booking.timeBooking NOT BETWEEN :startOfDay AND :endOfDay)`,
        { startOfDay, endOfDay },
      );
    }
  
    if (filter) {
      queryBuilder.andWhere('table.name ILIKE :filter', { filter: `%${filter}%` });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    try {
      const [tables, total] = await queryBuilder.getManyAndCount();

      const results = tables.map((table) => {
        const { id, name, restaurantId, capacity } = table;
        return { id, name, restaurantId, capacity };
      });
      
      return {
        results,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

    } catch (error) {
      console.error('Error in findAvailableTables:', error);
      throw new Error('Internal Server Error');
    }
  }

  async findOne(id: number): Promise<GetTableDto> {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return {
      id: table.id,
      name: table.name,
      restaurantId: table.restaurantId,
      capacity: table.capacity,
    };
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }

    const existingTable = await this.tableRepository.findOne({
      where: {
        name: updateTableDto.name,
        restaurantId: updateTableDto.restaurantId,
      },
    });

    if (existingTable) {
      throw new NotFoundException(
        `Table with name ${updateTableDto.name} already exists`,
      );
    }
    if ((updateTableDto.capacity ?? 0) < 1) {
      throw new NotFoundException(`Table capacity must be greater than 0`);
    }
    return await this.tableRepository.save({ ...table, ...updateTableDto });
  }

  async remove(id: number) {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    await this.tableRepository.remove(table);
  }
}


