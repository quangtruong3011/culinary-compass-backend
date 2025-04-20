import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags } from '@nestjs/swagger';
import { And } from 'typeorm';
import { PaginationOptions } from 'src/shared/base/pagination.interface';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() options: PaginationOptions) {
    return this.bookingsService.findAll(options);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  findAllByUserId(@Param('userId') userId: number, @Query() options: PaginationOptions) {
    return this.bookingsService.findAllByUserId(+userId, options);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.bookingsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
  //   return this.bookingsService.update(+id, updateBookingDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(+id);
  }
}