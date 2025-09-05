import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(5, { message: 'Store name must be at least 5 characters long' })
  @MaxLength(60, { message: 'Store name must not exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;
}