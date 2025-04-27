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
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationOptions } from 'src/shared/base/pagination.interface';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // findAll(@Query() options: PaginationOptions) {
  //   return this.bookingsService.findAll(options);
  // }

  @Get('find-all-for-user')
  @HttpCode(HttpStatus.OK)
  findAllForUser(@Query() options: PaginationOptions, @Req() req) {
    return this.bookingsService.findAllForUser(options, req.user.id);
  }

  @Get('find-one-for-user/:id')
  @HttpCode(HttpStatus.OK)
  findOneForUser(@Param('id') id: number) {
    return this.bookingsService.findOneForUser(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Patch('confirm/:id')
  @HttpCode(HttpStatus.OK)
  confirmBooking(@Param('id') id: number) {
    return this.bookingsService.confirmBooking(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(+id);
  }
}
