export class GetRestauntDto {
  id: number;
  ownerId?: number;
  name: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  phone: string;
  description: string;
  website?: string;
  openingTime: Date;
  closingTime: Date;
  images: string[];
}
