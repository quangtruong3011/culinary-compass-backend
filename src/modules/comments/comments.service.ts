import { Injectable, Inject } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async findAllByRestaurant(
    options?: PaginationOptions,
    restaurantId?: number,
  ): Promise<PaginationResult<GetCommentDto[]>> {
    const {
      page = Math.max(1, Number(options?.page) || 1),
      limit = Math.min(Math.max(1, Number(options?.limit) || 10), 100),
      filterText = options?.filterText?.trim() || undefined,
    } = options || {};

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .select(['comment.id', 'comment.restaurantId', 'comment.content']);

    if (restaurantId) {
      queryBuilder.where('comment.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
