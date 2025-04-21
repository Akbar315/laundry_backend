import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { User } from '../models/user.model';
// import { UpdateProfileDto } from '../dto/profile.dto';
import { User } from './models/user.model';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Get user profile by id
   */
  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if email is being updated and is not already taken
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const emailExists = await this.userModel.findOne({
        where: { email: updateProfileDto.email },
      });
      
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }
    
    // Check if phone number is being updated and is not already taken
    if (updateProfileDto.ph_no && updateProfileDto.ph_no !== user.ph_no) {
      const phoneExists = await this.userModel.findOne({
        where: { ph_no: updateProfileDto.ph_no },
      });
      
      if (phoneExists) {
        throw new ConflictException('Phone number already in use');
      }
    }
    
    // Update user profile
    await user.update(updateProfileDto);
    
    return user;
  }
}