export class GetBookingDto {
  id: number;
  userId?: number;
  restaurantId?: number;
  name: string;
  phone: string;
  email?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  guests: number;
  isConfirmed: boolean;
}

export interface GetBookingDetailsDto {
  id: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  name: string;
  phone: string;
  email?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  guests: number;
  isConfirmed: boolean;
}
