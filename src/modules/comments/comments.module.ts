import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CommentController } from './comments.controller';
import { commentProviders } from './comment.provider';
import { CommentService } from './comments.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [...commentProviders, CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
