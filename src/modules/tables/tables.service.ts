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
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TablesService {
  constructor(
    @Inject('TABLE_REPOSITORY')
    private tableRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto) {
    return await this.tableRepository.save(createTableDto);
  }

  async findAll(
    options?: PaginationOptions & { restaurantId?: number },
  ): Promise<PaginationResult<GetTableDto[]>> {
    const {
      page = Math.max(1, Number(options?.page)),
      limit = Math.min(Math.max(1, Number(options?.limit)), 100),
      filterText = options?.filterText?.trim() || undefined,
      restaurantId = options?.restaurantId,
    } = options || {};

    const whereConditions: any = {};

    if (restaurantId) {
      whereConditions.restaurantId = restaurantId;
    }

    if (filterText) {
      whereConditions.name = ILike(`%${filterText}%`);
    }

    const [tables, total] = await this.tableRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    const results = tables.map((table) => {
      const { id, name, restaurantId, numberOfSeats, status } = table;
      return { id, name, restaurantId, numberOfSeats, status };
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
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) throw new NotFoundException(`Table with id ${id} not found`);
    const updatedTable = this.tableRepository.merge(table, updateTableDto);
    return await this.tableRepository.save(updatedTable);
  }

  async remove(id: number) {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return await this.tableRepository.softDelete(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateTableStatuses() {
    const tables = await this.tableRepository.find({
      relations: ['bookings'],
    });

    for (const table of tables) {
      const currentStatus = await table.getCurrentStatus();
      if (table.status !== currentStatus) {
        table.status = currentStatus;
        await this.tableRepository.save(table);
      }
    }
  }
}
