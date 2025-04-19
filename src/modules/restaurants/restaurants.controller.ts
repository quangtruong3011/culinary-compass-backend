import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PaginationOptions } from 'src/shared/base/pagination.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('images'))
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req) {
    const userId = req.user.userId;
    return this.restaurantsService.create(createRestaurantDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllForAdmin(@Query() options: PaginationOptions, @Req() req) {
    const userId = req.user.userId;
    return this.restaurantsService.findAllRestaurantForAdmin(options, userId);
  }

  @Public()
  @Get('/find-all-for-user')
  @HttpCode(HttpStatus.OK)
  findAllForUser(@Query() options: PaginationOptions) {
    return this.restaurantsService.findAllRestaurantForUser(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOneRestaurnForAdmin(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.restaurantsService.remove(+id, userId);
  }
}
