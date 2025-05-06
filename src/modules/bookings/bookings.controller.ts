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
import { BookingStatusDto } from './dto/booking-status.dto';
import { GetAvailableTableDto } from './dto/get-available-table.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get('find-all-for-user')
  @HttpCode(HttpStatus.OK)
  findAllForUser(@Query() options: PaginationOptions, @Req() req) {
    return this.bookingsService.findAllForUser(options, req.user.id);
  }

  @Get('find-all-for-admin')
  @HttpCode(HttpStatus.OK)
  findAllByAdmin(
    @Query() options: PaginationOptions & { restaurantId: number },
  ) {
    return this.bookingsService.findAllForAdmin(options);
  }

  @Get('find-one-for-admin/:id')
  @HttpCode(HttpStatus.OK)
  findOneForAdmin(@Param('id') id: number) {
    return this.bookingsService.findOneForAdmin(+id);
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

  @Patch(':id/status-booking')
  @HttpCode(HttpStatus.OK)
  updateStatusBooking(
    @Param('id') id: number,
    @Body('status') status: BookingStatusDto,
  ) {
    return this.bookingsService.updateStatusBooking(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(+id);
  }

  @Patch(':id/assign-tables')
  @HttpCode(HttpStatus.OK)
  assignTables(@Param('id') id: number, @Body('tableIds') tableIds: number[]) {
    return this.bookingsService.assignTablesToBooking(+id, tableIds);
  }

  @Get('available-table')
  @HttpCode(HttpStatus.OK)
  availableTable(@Query() query: GetAvailableTableDto) {
    const { restaurantId, date, startTime, endTime } = query;
    const parsedDate = new Date(date);
    const parsedStartTime = new Date(`${date}T${startTime}`);
    const parsedEndTime = new Date(`${date}T${endTime}`);

    return this.bookingsService.availableTable(
      restaurantId,
      parsedDate,
      parsedStartTime,
      parsedEndTime,
    );
  }

  @Get(':ownerId/dashboard')
  @HttpCode(HttpStatus.OK)
  getDashboardData(@Param('ownerId') ownerId: number) {
    return this.bookingsService.getDashboardData(+ownerId);
  }

  @Patch(':id/comment')
  @HttpCode(HttpStatus.OK)
  comment(@Param('id') id: number) {
    return this.bookingsService.commentRestaurant(+id);
  }
}
