import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../user/models/user.model';

export enum BookingStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Table({
  tableName: 'bookings',
  timestamps: true,
})
export class Booking extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  order_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  services: string[];

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  booking_date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  booking_time: string;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    allowNull: false,
    defaultValue: BookingStatus.ACTIVE,
  })
  status: BookingStatus;
}