import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetAvailableTableDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
