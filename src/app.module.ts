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
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: ['.development.env'],
    // }),
    ConfigModule.forRoot(),
    DatabaseModule,

    AuthModule,
    UsersModule,
    RolesModule,
    RestaurantsModule,
    TablesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
})
export class AppModule {}
