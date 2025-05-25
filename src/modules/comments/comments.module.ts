import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CommentController } from './comments.controller';
import { commentProviders } from './comment.provider';
import { CommentService } from './comments.service';
import { UsersModule } from '../users/users.module';
import { userProviders } from '../users/user.provider';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [CommentController],
  providers: [...commentProviders, ...userProviders, CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
