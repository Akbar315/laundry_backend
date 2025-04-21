import { Column, Model, Table, DataType } from 'sequelize-typescript';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
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
  ph_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: true,
  })
  gender: Gender;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otp: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  access_token: string;
}