import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  restaurantId: number;

  @ApiProperty({
    example: 'Nguyen Van A',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '0123456789',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '',
  })
  email?: string;

  @ApiProperty({
    example: '2025-10-01',
  })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    example: '10:00:00',
  })
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    example: '12:00:00',
  })
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({
    example: 2,
  })
  @IsNotEmpty()
  guests: number;

  note?: string;
}
