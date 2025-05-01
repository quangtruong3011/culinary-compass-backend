export class GetTableDto {
  id: number;
  name: string;
  restaurantId: number;
  numberOfSeats: number;
  status: string; // 'available', 'occupied', 'reserved'
}
