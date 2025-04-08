// src/auth/auth.service.ts
import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, LoginDto, UserRole } from './dto/phone-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a random 5-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  /**
   * Register a new user with phone number and name
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const { ph_no, name, role = UserRole.USER } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      where: { ph_no },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Generate OTP
    const otp = this.generateOtp();
    
    // Create new user
    const user = await this.userModel.create({
      ph_no,
      name,
      role,
      otp,
    });
    
    // Generate JWT with user info
    const payload = { 
      ph_no, 
      sub: user.id,
      role: user.role
    };
    const accessToken = this.jwtService.sign(payload);
    
    // Update user with token
    await user.update({ access_token: accessToken });
    
    // In a real app, you'd send the OTP via SMS here
    
    return user;
  }

  /**
   * Login existing user with phone number
   */
  async login(loginDto: LoginDto): Promise<User> {
    const { ph_no } = loginDto;

    // Check if user exists
    const user = await this.userModel.findOne({
      where: { ph_no },
    });

    if (!user) {
      throw new NotFoundException('User with this phone number not found');
    }

    // Generate OTP
    const otp = this.generateOtp();
    
    // Generate JWT with user info
    const payload = { 
      ph_no, 
      sub: user.id,
      role: user.role
    };
    const accessToken = this.jwtService.sign(payload);
    
    // Update user with new OTP and token
    await user.update({ 
      otp, 
      access_token: accessToken 
    });
    
    // In a real app, you'd send the OTP via SMS here
    
    return user;
  }

  /**
   * Verify OTP for a phone number
   */
  async verifyOtp(ph_no: string, otpToVerify: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { ph_no },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otpToVerify) {
      throw new BadRequestException('Invalid OTP');
    }

    // Generate a fresh token with user info including role
    const payload = { 
      ph_no: user.ph_no, 
      sub: user.id,
      role: user.role
    };
    const accessToken = this.jwtService.sign(payload);
    
    // Clear OTP and update token after successful verification
    await user.update({ 
      otp: null,
      access_token: accessToken
    });

    return user;
  }
}