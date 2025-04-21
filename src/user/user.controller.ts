import { 
  Body, 
  Controller, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Patch, 
  Res,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
// import { UserService } from '../services/user.service';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { UpdateProfileDto, ProfileResponseDto } from '../dto/profile.dto';
import { UpdateProfileDto, ProfileResponseDto } from './dto/profile.dto';
// import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  async getProfile(@CurrentUser('sub') userId: string, @Res() res: Response) {
    try {
      const user = await this.userService.getProfile(userId);
      
      // Remove sensitive data before returning
      const { otp: _, access_token: __, ...result } = user.get({ plain: true });
      
      return res.json({
        ...result,
        message: 'Profile retrieved successfully'
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to retrieve profile',
        error: error.message
      });
    }
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile updated successfully',
    type: ProfileResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email or phone number already in use'
  })
  async updateProfile(
    @CurrentUser('sub') userId: string, 
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.updateProfile(userId, updateProfileDto);
      
      // Remove sensitive data before returning
      const { otp: _, access_token: __, ...result } = user.get({ plain: true });
      
      return res.json({
        ...result,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message
        });
      }
      
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          message: error.message
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }
}