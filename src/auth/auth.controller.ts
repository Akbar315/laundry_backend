// src/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  Res, 
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { 
  RegisterDto, 
  LoginDto, 
  VerifyOtpDto, 
  UserResponseDto, 
  OtpResponseDto 
} from './dto/phone-auth.dto';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user with phone and name' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered and OTP sent',
    type: OtpResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User with this phone number already exists'
  })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerDto);
      
      // Set access token in header
      res.setHeader('Authorization', `Bearer ${user.access_token}`);
      
      // Return basic user details with OTP
      return res.status(HttpStatus.CREATED).json({
        id: user.id,
        ph_no: user.ph_no,
        otp: user.otp, // In production, don't return OTP in response
        message: 'User registered successfully. OTP has been generated.'
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          message: error.message
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to register user',
        error: error.message
      });
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with phone number' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP sent for login',
    type: OtpResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User with this phone number not found'
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const user = await this.authService.login(loginDto);
      
      // Set access token in header
      res.setHeader('Authorization', `Bearer ${user.access_token}`);
      
      // Return basic user details with OTP
      return res.json({
        id: user.id,
        ph_no: user.ph_no,
        otp: user.otp, // In production, don't return OTP in response
        message: 'Login initiated. OTP has been generated.'
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to process login',
        error: error.message
      });
    }
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP verified successfully',
    type: UserResponseDto,
    headers: {
      'Authorization': {
        description: 'Bearer token for authentication',
        schema: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid OTP or user not found'
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res() res: Response) {
    try {
      const { ph_no, otp } = verifyOtpDto;
      const user = await this.authService.verifyOtp(ph_no, otp);
      
      // Set access token in header
      res.setHeader('Authorization', `Bearer ${user.access_token}`);
      
      // Remove sensitive data before returning
      const { otp: _, access_token: __, ...result } = user.get({ plain: true });
      
      return res.json({
        ...result,
        message: 'OTP verified successfully'
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to verify OTP',
        error: error.message
      });
    }
  }
}