export class GetRestaurantDto {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  phone: string;
  website?: string;
  openingTime: Date;
  closingTime: Date;
  image: string;
}
