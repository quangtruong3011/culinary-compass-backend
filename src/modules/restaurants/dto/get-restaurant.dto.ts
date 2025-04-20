export class GetRestauntDto {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  website?: string;
  openingTime: Date;
  closingTime: Date;
}
