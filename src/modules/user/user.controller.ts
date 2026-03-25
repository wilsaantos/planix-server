import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: { userId: string } }) {
    return this.userService.findById(req.user.userId);
  }
}
