import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/base/pagination.interface';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async findAllForAdmin(
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
      .leftJoin('comment.booking', 'booking')
      .leftJoin('booking.user', 'user')
      .leftJoin('booking.restaurant', 'restaurant')
      .select([
        'comment.id as id',
        'comment.bookingId as bookingId',
        'booking.restaurantId as restaurantId',
        'booking.userId as userId',
        'user.name as userName',
        'user.imageUrl as imageUrl',
        'comment.content as content',
        'comment.updatedAt as updatedAt',
        'comment.likeCount as likeCount',
      ])
      .orderBy('updatedAt', 'DESC');

    if (restaurantId) {
      queryBuilder.where('booking.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const results = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllForUser(
    options?: PaginationOptions & { restaurantId?: number },
  ): Promise<PaginationResult<GetCommentDto[]>> {
    const {
      page = Math.max(1, Number(options?.page) || 1),
      limit = Math.min(Math.max(1, Number(options?.limit) || 10), 100),
      filterText = options?.filterText?.trim() || undefined,
      restaurantId = options?.restaurantId,
    } = options || {};

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.booking', 'booking')
      .leftJoin('booking.user', 'user')
      .select([
        'comment.id as id',
        'comment.bookingId as bookingId',
        'booking.restaurantId as restaurantId',
        'booking.userId as userId',
        'user.name as userName',
        'user.imageUrl as imageUrl',
        'comment.content as content',
        'comment.updatedAt as updatedAt',
        'comment.likeCount as likeCount',
      ])
      .orderBy('likeCount', 'DESC');

    if (restaurantId) {
      queryBuilder.where('booking.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const results = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneByBookingId(bookingId: number) {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.booking', 'booking')
      .leftJoin('booking.user', 'user')
      .where('comment.bookingId = :bookingId', { bookingId })
      .select([
        'comment.id as id',
        'comment.bookingId as bookingId',
        'booking.restaurantId as restaurantId',
        'booking.userId as userId',
        'user.name as userName',
        'comment.content as content',
        'comment.updatedAt as updatedAt',
        'comment.likeCount as likeCount',
      ])
      .getRawOne();

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new Error('Comment not found');
    }
    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async isUserLikedComment(id: number, userId: number): Promise<boolean> {
      const comment = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoin('comment.users', 'user')
        .where('comment.id = :id', { id })
        .andWhere('user.id = :userId', { userId })
        .getOne();

      return !!comment;
  }

  async updateLikeCount(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const userComment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.users', 'user')
      .where('comment.id = :id', { id })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    let likeCount = Number(comment.likeCount);

    if (userComment) {
      likeCount -= 1;
      await this.commentRepository
        .createQueryBuilder()
        .relation(Comment, 'users')
        .of(comment)
        .remove(userId);
    } else {
      likeCount += 1;
      await this.commentRepository
        .createQueryBuilder()
        .relation(Comment, 'users')
        .of(comment)
        .add(userId);
    }
    comment.likeCount = likeCount;
    return this.commentRepository.save(comment);
  }
}
