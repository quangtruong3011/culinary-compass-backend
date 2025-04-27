import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
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

  @Get('user')
  @HttpCode(HttpStatus.OK)
  findAllByUserId(@Query() options: PaginationOptions & { userId: number }) {
    return this.bookingsService.findAllByUserId(options);
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  findAllByAdmin(@Query() options: PaginationOptions & { restaurantId: number }) {
    return this.bookingsService.findAllByRestaurantId(options);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  statusBooking(@Param('id') id: number, @Body('status') status: 'confirmed' | 'cancelled' | 'pending' | 'completed') {
    return this.bookingsService.statusBooking(+id, status);
  }

  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.bookingsService.remove(+id);
  // }
}
