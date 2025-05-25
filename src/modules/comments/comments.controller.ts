import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationOptions } from 'src/shared/base/pagination.interface';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get('find-all-for-user')
  @HttpCode(HttpStatus.OK)
  findAllForUser(
    @Query() options: PaginationOptions & { restaurantId: number },
  ) {
    return this.commentService.findAllForUser(options);
  }

  @Get('find-all-for-admin')
  @HttpCode(HttpStatus.OK)
  findAllForAdmin(
    @Query('restaurantId') restaurantId: number,
    @Query() options: PaginationOptions,
  ) {
    return this.commentService.findAllForAdmin(options, Number(restaurantId));
  }

  @Get('/:bookingId')
  @HttpCode(HttpStatus.OK)
  findOneByBookingId(@Param('bookingId') bookingId: number) {
    return this.commentService.findOneByBookingId(+bookingId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Get('is-liked')
  @HttpCode(HttpStatus.OK)
  isUserLikedComment(
    @Query('id') id: number,
    @Query('userId') userId: number,
  ) {
    return this.commentService.isUserLikedComment(id, userId);
  }

  @Patch(':id/like')
  @HttpCode(HttpStatus.OK)
  like(@Param('id') id: number, @Body('userId') userId: number) {
    return this.commentService.updateLikeCount(+id, userId);
  }
}
