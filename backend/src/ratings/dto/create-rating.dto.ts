import { IsNumber, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  storeId: number;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;

  userId?: number; // Will be set from the JWT token
}