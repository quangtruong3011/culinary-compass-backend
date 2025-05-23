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
    return this.restaurantsService.create(createRestaurantDto, req.user.id);
  }

  @Get('find-all-for-admin')
  @HttpCode(HttpStatus.OK)
  findAllForAdmin(@Query() options: PaginationOptions, @Req() req) {
    return this.restaurantsService.findAllRestaurantForAdmin(
      options,
      req.user.id,
    );
  }

  @Public()
  @Get('find-all-for-user')
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
    return this.restaurantsService.remove(+id, req.user.id);
  }

  @Public()
  @Get('find-one-for-user/:id')
  @HttpCode(HttpStatus.OK)
  findOneForUser(@Param('id') id: string) {
    return this.restaurantsService.findOneRestaurantForUser(+id);
  }
}
