import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, BadRequestException } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PaginationOptions } from 'src/shared/base/pagination.interface';
import { ApiResponse } from '@nestjs/swagger';
import { And } from 'typeorm';
import { isValid } from 'date-fns';
import { Public } from '../auth/decorators/public.decorator';
import { parseISO } from 'date-fns/parseISO';

@Public()
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Table created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() options: PaginationOptions) {
    return this.tablesService.findAll(options);
  }

  @Get('restaurant/:restaurantId')
  @HttpCode(HttpStatus.OK)
  findAllAdminByRestaurant(@Param('restaurantId') restaurantId: number, @Query() options: PaginationOptions) {
    if (!restaurantId && isNaN(+restaurantId)) {
      throw new Error('restaurantId must be a number');
    }
    return this.tablesService.findAllByRestaurant(+restaurantId, options);
  }

  @Get('available/:restaurantId')
  @HttpCode(HttpStatus.OK)
  async findAvailableTables(@Param('restaurantId') restaurantId: number,@Query('timeBooking') timeBookingStr: string, @Query() options: PaginationOptions) {
    if (!timeBookingStr) {
      throw new BadRequestException('timeBooking is required');
    }

    const timeBooking = parseISO(timeBookingStr); // đảm bảo parse chuẩn định dạng ISO
    if (!isValid(timeBooking)) {
      throw new BadRequestException('Invalid timeBooking format');
    }

    return this.tablesService.findAvailableTables(+restaurantId,timeBooking, options);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.tablesService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(+id, updateTableDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tablesService.remove(+id);
  }
}
