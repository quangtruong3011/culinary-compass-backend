import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationOptions {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Min(100)
  limit?: number;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  filter?: string;
}

export class PaginationResult<T> {
  results: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
