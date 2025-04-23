import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 2,
  })
  @IsNotEmpty()
  people: number;

  @ApiProperty({
    example: '2024-10-01 19:00:00',
  })
  @IsNotEmpty()
  timeBooking: Date;

  @ApiProperty({
    example: [1],
  })
  @IsNotEmpty()
  tableIds: number[];
}
