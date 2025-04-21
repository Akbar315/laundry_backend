import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    Patch, 
    Res,
    NotFoundException,
    ParseUUIDPipe,
  } from '@nestjs/common';
//   import { BookingService } from '../services/booking.service';
import { BookingService } from './booking.service';
  import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  import { UpdateBookingStatusDto, BookingResponseDto } from './dto/booking.dto';
  import { Response } from 'express';
  
  @ApiTags('admin-bookings')
  @Controller('admin/bookings')
  @ApiBearerAuth('access-token')
  export class AdminBookingController {
    constructor(private readonly bookingService: BookingService) {}
  
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin: Get all bookings' })
    @ApiResponse({ 
      status: 200, 
      description: 'Retrieved all bookings',
      type: [BookingResponseDto]
    })
    async getAllBookings(@Res() res: Response) {
      try {
        const bookings = await this.bookingService.getAllBookings();
        
        return res.json({
          bookings,
          message: 'All bookings retrieved successfully'
        });
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to retrieve bookings',
          error: error.message
        });
      }
    }
  
    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin: Update booking status' })
    @ApiResponse({ 
      status: 200, 
      description: 'Booking status updated successfully',
      type: BookingResponseDto
    })
    @ApiResponse({ 
      status: 404, 
      description: 'Booking not found'
    })
    async updateBookingStatus(
      @Param('id', ParseUUIDPipe) bookingId: string,
      @Body() updateStatusDto: UpdateBookingStatusDto,
      @Res() res: Response
    ) {
      try {
        const booking = await this.bookingService.adminUpdateBookingStatus(
          bookingId, 
          updateStatusDto
        );
        
        return res.json({
          ...booking.get({ plain: true }),
          message: `Booking status updated to ${updateStatusDto.status}`
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: error.message
          });
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to update booking status',
          error: error.message
        });
      }
    }
  }