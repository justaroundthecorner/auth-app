import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() body: { email: string; name: string; password: string }) {
    return this.userService.signup(body.email, body.name, body.password);
  }

  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    const user = await this.userService.validateUser(body.email, body.password);
    if (user) {
      return { message: 'Login successful' };
    }
    throw new Error('Invalid credentials');
  }
}
