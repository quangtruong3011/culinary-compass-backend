import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumberString()
  ownerId: number;

  @ApiProperty({
    example: 'Vịt 34',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example:
      '171 Đ. Nguyễn Tuân, Thanh Xuân Trung, Thanh Xuân, Hà Nội, Việt Nam',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'Hà Nội',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: '0976643434',
  })
  @IsNumberString()
  phone: string;

  @ApiProperty({
    example: 'https://vit34.com',
    required: false,
  })
  @IsNotEmpty()
  @IsUrl()
  website: string;

  @ApiProperty({
    example: '10:00 AM',
  })
  @IsNotEmpty()
  @IsString()
  openingTime: string;

  @ApiProperty({
    example: '11:00 PM',
  })
  @IsNotEmpty()
  @IsString()
  closingTime: string;
}
