import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { bookingProviders } from "./booking.provider";
import { DatabaseModule } from "src/database/database.module";
import { TablesModule } from "../tables/tables.module";

@Module({
    imports: [DatabaseModule, TablesModule],
    controllers: [BookingsController],
    providers: [...bookingProviders, BookingsService],
    exports: [BookingsService],
    })
export class BookingsModule { }