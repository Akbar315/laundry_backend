import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
// import { UserService } from './services/user.service';
// import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}