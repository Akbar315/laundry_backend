import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString, ArrayMinSize, Matches } from 'class-validator';
import { BookingStatus } from '../models/booking.model';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Array of laundry services',
    example: ['washing', 'dry cleaning', 'ironing'],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one service must be selected' })
  @IsString({ each: true })
  services: string[];

  @ApiProperty({
    description: 'Booking date (format: YYYY-MM-DD)',
    example: '2025-05-18',
  })
  @IsNotEmpty()
  @IsDateString({}, { message: 'Please provide a valid date in YYYY-MM-DD format' })
  booking_date: string;

  @ApiProperty({
    description: 'Booking time (format: HH:MM)',
    example: '18:00',
  })
  @IsNotEmpty()
  @IsString()
  // @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
  //   message: 'Time must be in 24-hour format (HH:MM)' 
  // })
  booking_time: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: 'Booking status',
    enum: BookingStatus,
    example: BookingStatus.COMPLETED,
  })
  @IsEnum(BookingStatus, { message: 'Status must be Active, Completed, or Cancelled' })
  status: BookingStatus;
}

export class BookingResponseDto {
  @ApiProperty({
    description: 'Booking ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Order ID',
    example: 'ORD-123456',
  })
  order_id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  user_id: string;

  @ApiProperty({
    description: 'Array of laundry services',
    example: ['washing', 'dry cleaning', 'ironing'],
    isArray: true,
  })
  services: string[];

  @ApiProperty({
    description: 'Booking date',
    example: '2025-05-18',
  })
  booking_date: string;

  @ApiProperty({
    description: 'Booking time',
    example: '18:00',
  })
  booking_time: string;

  @ApiProperty({
    description: 'Booking status',
    enum: BookingStatus,
    example: BookingStatus.ACTIVE,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-04-22T14:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-04-22T14:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Response message',
    example: 'Booking created successfully',
  })
  message: string;
}