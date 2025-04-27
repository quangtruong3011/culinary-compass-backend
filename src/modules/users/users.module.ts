import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.provider';
import { roleProviders } from '../roles/role.providers';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [UsersController],
  providers: [...userProviders, ...roleProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
