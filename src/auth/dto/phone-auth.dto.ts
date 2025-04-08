// src/auth/dto/phone-auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class RegisterDto {
  @ApiProperty({
    description: 'User phone number (10 digits)',
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  ph_no: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}

export class LoginDto {
  @ApiProperty({
    description: 'User phone number (10 digits)',
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  ph_no: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User phone number (10 digits)',
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  ph_no: string;

  @ApiProperty({
    description: '5-digit OTP',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  @Matches(/^[0-9]+$/, { message: 'OTP must contain only digits' })
  otp: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User phone number',
    example: '9876543210',
  })
  ph_no: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Status message',
    example: 'OTP verified successfully',
  })
  message: string;
}

export class OtpResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User phone number',
    example: '9876543210',
  })
  ph_no: string;

  @ApiProperty({
    description: '5-digit OTP (should not be returned in production)',
    example: '12345',
  })
  otp: string;

  @ApiProperty({
    description: 'Status message',
    example: 'OTP has been generated successfully',
  })
  message: string;
}