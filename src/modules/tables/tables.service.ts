import { Inject, Injectable, NotFoundException, Options } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { GetTableDto } from './dto/get-table.dto';
import { ILike, Repository } from 'typeorm';

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

  async findAllAdminByRestaurant(
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

  async findAllCustomerByRestaurant(
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
        ? { name: ILike(`${filter}`), restaurantId, isAvailable: true }
        : { restaurantId, isAvailable: true },
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

    if (existingTable && existingTable.id !== id) {
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
