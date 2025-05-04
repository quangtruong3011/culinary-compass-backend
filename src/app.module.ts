import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { TablesModule } from './modules/tables/tables.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { MulterModule } from '@nestjs/platform-express';
import { RestaurantImagesModule } from './modules/restaurant-images/restaurant-images.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: ['.development.env'],
    // }),
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CloudinaryModule,
    AuthModule,
    UsersModule,
    RolesModule,
    RestaurantsModule,
    RestaurantImagesModule,
    TablesModule,
    BookingsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
