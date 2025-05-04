import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
