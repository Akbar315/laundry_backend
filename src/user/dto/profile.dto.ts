import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Gender } from '../models/user.model';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'User phone number (10 digits)',
    example: '9876543210',
  })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  ph_no?: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email?: string;

  @ApiProperty({
    description: 'User gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender?: Gender;
}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '9876543210',
  })
  ph_no: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    nullable: true,
  })
  email: string;

  @ApiProperty({
    description: 'User gender',
    enum: Gender,
    example: Gender.MALE,
    nullable: true,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Status message',
    example: 'Profile updated successfully',
  })
  message: string;
}