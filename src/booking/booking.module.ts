import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './models/booking.model';
import { User } from '../user/models/user.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { AdminBookingController } from './admin-booking.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking, User]),
  ],
  providers: [BookingService],
  controllers: [BookingController, AdminBookingController],
  exports: [BookingService],
})
export class BookingModule {}