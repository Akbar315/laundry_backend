import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    Post, 
    Patch, 
    Res,
    NotFoundException,
    BadRequestException,
    ParseUUIDPipe,
  } from '@nestjs/common';
//   import { BookingService } from '../services/booking.service';
import { BookingService } from './booking.service';
  import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  import { 
    CreateBookingDto, 
    UpdateBookingStatusDto, 
    BookingResponseDto 
  } from './dto/booking.dto';
//   import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
  import { Response } from 'express';
  
  @ApiTags('bookings')
  @Controller('bookings')
  @ApiBearerAuth('access-token')
  export class BookingController {
    constructor(private readonly bookingService: BookingService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new laundry booking' })
    @ApiResponse({ 
      status: 201, 
      description: 'Booking created successfully',
      type: BookingResponseDto
    })
    async createBooking(
      @CurrentUser('sub') userId: string, 
      @Body() createBookingDto: CreateBookingDto,
      @Res() res: Response
    ) {
      try {
        const booking = await this.bookingService.createBooking(userId, createBookingDto);
        
        return res.status(HttpStatus.CREATED).json({
          ...booking.get({ plain: true }),
          message: 'Booking created successfully'
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: error.message
          });
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to create booking',
          error: error.message
        });
      }
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all bookings for the current user' })
    @ApiResponse({ 
      status: 200, 
      description: 'Retrieved all bookings',
      type: [BookingResponseDto]
    })
    async getUserBookings(
      @CurrentUser('sub') userId: string,
      @Res() res: Response
    ) {
      try {
        const bookings = await this.bookingService.getUserBookings(userId);
        
        return res.json({
          bookings,
          message: 'Bookings retrieved successfully'
        });
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to retrieve bookings',
          error: error.message
        });
      }
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get booking by ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'Booking retrieved successfully',
      type: BookingResponseDto
    })
    @ApiResponse({ 
      status: 404, 
      description: 'Booking not found'
    })
    async getBookingById(
      @CurrentUser('sub') userId: string,
      @Param('id', ParseUUIDPipe) bookingId: string,
      @Res() res: Response
    ) {
      try {
        const booking = await this.bookingService.getBookingById(userId, bookingId);
        
        return res.json({
          ...booking.get({ plain: true }),
          message: 'Booking retrieved successfully'
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: error.message
          });
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to retrieve booking',
          error: error.message
        });
      }
    }
  
    @Get('order/:orderId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get booking by order ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'Booking retrieved successfully',
      type: BookingResponseDto
    })
    @ApiResponse({ 
      status: 404, 
      description: 'Booking not found'
    })
    async getBookingByOrderId(
      @CurrentUser('sub') userId: string,
      @Param('orderId') orderId: string,
      @Res() res: Response
    ) {
      try {
        const booking = await this.bookingService.getBookingByOrderId(userId, orderId);
        
        return res.json({
          ...booking.get({ plain: true }),
          message: 'Booking retrieved successfully'
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: error.message
          });
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to retrieve booking',
          error: error.message
        });
      }
    }
  
    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update booking status' })
    @ApiResponse({ 
      status: 200, 
      description: 'Booking status updated successfully',
      type: BookingResponseDto
    })
    @ApiResponse({ 
      status: 404, 
      description: 'Booking not found'
    })
    @ApiResponse({ 
      status: 400, 
      description: 'Cannot update status for completed or cancelled bookings'
    })
    async updateBookingStatus(
      @CurrentUser('sub') userId: string,
      @Param('id', ParseUUIDPipe) bookingId: string,
      @Body() updateStatusDto: UpdateBookingStatusDto,
      @Res() res: Response
    ) {
      try {
        const booking = await this.bookingService.updateBookingStatus(
          userId, 
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
        
        if (error instanceof BadRequestException) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: error.message
          });
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to update booking status',
          error: error.message
        });
      }
    }
  
    @Patch(':id/cancel')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cancel booking' })
    @ApiResponse({ 
      status: 200, 
      description: 'Booking cancelled successfully',
      type: BookingResponseDto
    })
    @ApiResponse({ 
      status: 404, 
      description: 'Booking not found'
    })
    @ApiResponse({ 
      status: 400, 
      description: 'Cannot cancel completed or already cancelled bookings'
    })
    async cancelBooking(
      @CurrentUser('sub') userId: string,
      @Param('id', ParseUUIDPipe) bookingId: string,
      @Res() res: Response
    ) {
      try {
        const booking = await this.bookingService.cancelBooking(userId, bookingId);
        
        return res.json({
          ...booking.get({ plain: true }),
          message: 'Booking cancelled successfully'
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: error.message
          });
        }
        
        if (error instanceof BadRequestException) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: error.message
          });
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to cancel booking',
          error: error.message
        });
      }
    }
  }