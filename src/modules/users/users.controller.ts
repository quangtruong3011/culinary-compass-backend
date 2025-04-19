import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from '../auth/constants/constants';
import { Roles } from '../auth/decorators/roles.decorator';
import { Gender } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // @Roles(RoleEnum.ADMIN, RoleEnum.MODERATOR)
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.MODERATOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.gender && !Object.values(Gender).includes(updateUserDto.gender)) {
      throw new BadRequestException('Gender must be either Male or Female');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
