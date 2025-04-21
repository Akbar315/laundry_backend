import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking, BookingStatus } from './models/booking.model';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
// import { User } from '../../user/models/user.model';
import { User } from 'src/user/models/user.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Generate a random order ID
   */
  private generateOrderId(): string {
    const prefix = 'ORD';
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    return `${prefix}-${randomNum}`;
  }

  /**
   * Create a new booking
   */
  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check if user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a unique order ID
    let orderId = this.generateOrderId();
    let existingOrder = await this.bookingModel.findOne({ where: { order_id: orderId } });
    
    // Ensure order ID is unique
    while (existingOrder) {
      orderId = this.generateOrderId();
      existingOrder = await this.bookingModel.findOne({ where: { order_id: orderId } });
    }

    // Create new booking
    const booking = await this.bookingModel.create({
      order_id: orderId,
      user_id: userId,
      services: createBookingDto.services,
      booking_date: createBookingDto.booking_date,
      booking_time: createBookingDto.booking_time,
      status: BookingStatus.ACTIVE, // Default status
    });

    return booking;
  }

  /**
   * Get all bookings for a user
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    const bookings = await this.bookingModel.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
    });

    return bookings;
  }

  /**
   * Get booking by ID
   */
  async getBookingById(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({
      where: { id: bookingId, user_id: userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Get booking by order ID
   */
  async getBookingByOrderId(userId: string, orderId: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({
      where: { order_id: orderId, user_id: userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    userId: string, 
    bookingId: string, 
    updateStatusDto: UpdateBookingStatusDto
  ): Promise<Booking> {
    const booking = await this.bookingModel.findOne({
      where: { id: bookingId, user_id: userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if booking is already completed or cancelled
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(`Cannot update status: Booking is already ${booking.status}`);
    }

    // Update status
    await booking.update({ status: updateStatusDto.status });

    return booking;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({
      where: { id: bookingId, user_id: userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new BadRequestException(`Cannot cancel booking: Booking is ${booking.status}`);
    }

    // Update status to cancelled
    await booking.update({ status: BookingStatus.CANCELLED });

    return booking;
  }

  /**
   * Admin: Get all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingModel.findAll({
      order: [['createdAt', 'DESC']],
      include: [User],
    });
  }

  /**
   * Admin: Update booking status
   */
  async adminUpdateBookingStatus(
    bookingId: string, 
    updateStatusDto: UpdateBookingStatusDto
  ): Promise<Booking> {
    const booking = await this.bookingModel.findByPk(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Update status
    await booking.update({ status: updateStatusDto.status });

    return booking;
  }
}