import { Table } from 'typeorm';

export class GetBookingDto {
  id: number;
  userId: number;
  timeCreate: Date;
  timeBooking: Date;
  people: number;
  tables: {
    id: number;
    name: string;
    // capacity: number;
  }[];
}
