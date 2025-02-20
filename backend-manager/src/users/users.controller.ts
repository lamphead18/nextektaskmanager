import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/user-request.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(@Req() req: AuthenticatedRequest) {
    return this.usersService.getUserById(req.user.userId);
  }
}
