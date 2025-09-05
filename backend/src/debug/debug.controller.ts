import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Controller('debug')
export class DebugController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('users')
  async getUsers() {
    try {
      const users = await this.usersService.findAll();
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash: user.password.substring(0, 10) + '...'
      }));
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('test-password')
  async testPassword(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.usersService.findByEmail(body.email);
      if (!user) {
        return { error: 'User not found' };
      }

      const isValid = await bcrypt.compare(body.password, user.password);
      return {
        userExists: true,
        passwordValid: isValid,
        userRole: user.role,
        passwordLength: user.password.length
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('simple-login')
  async simpleLogin(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      if (!user) {
        return { error: 'Invalid credentials' };
      }

      const result = await this.authService.login(user);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }
}
