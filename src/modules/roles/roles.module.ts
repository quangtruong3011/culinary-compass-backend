import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { roleProviders } from './role.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [...roleProviders, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
