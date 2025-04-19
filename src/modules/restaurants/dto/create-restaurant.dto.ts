import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumberString()
  ownerId: number;

  @ApiProperty({
    example: 'Vịt 34 Cơ sở 7',
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
  province: string;

  @ApiProperty({
    example: 'Thanh Xuân',
  })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({
    example: 'Thanh Xuân Trung',
  })
  @IsNotEmpty()
  @IsString()
  ward: string;

  @ApiProperty({
    example: '0976643434',
  })
  @IsNumberString()
  phone: string;

  @ApiProperty({
    example: 'https://vit34.com',
    required: false,
  })
  @IsUrl()
  website: string;

  @ApiProperty({
    example: Date.now(),
  })
  @IsNotEmpty()
  @IsString()
  openingTime: string;

  @ApiProperty({
    example: Date.now(),
  })
  @IsNotEmpty()
  @IsString()
  closingTime: string;

  @IsNotEmpty()
  @IsArray()
  images: string[];
}
