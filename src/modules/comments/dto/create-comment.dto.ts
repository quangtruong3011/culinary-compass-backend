import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  bookingId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'comment 1',
  })
  content: string;

}
