import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationOptions } from 'src/shared/base/pagination.interface';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllByRestaurant(
    @Query('restaurantId') restaurantId: number,
    @Query() options: PaginationOptions,
  ) {
    return this.commentService.findAllByRestaurant(
      options,
      Number(restaurantId),
    );
  }
}
