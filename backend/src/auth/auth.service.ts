import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    // Trim whitespace from password
    const trimmedPassword = password.trim();

    console.log('� validateUser called with:', {
      email,
      originalPassword: JSON.stringify(password),
      trimmedPassword: JSON.stringify(trimmedPassword),
      passwordLength: password.length,
      trimmedLength: trimmedPassword.length
    });

    const user = await this.usersService.findByEmail(email);

    if (user && await bcrypt.compare(trimmedPassword, user.password)) {
      console.log('✅ Password validation successful');
      const { password: userPassword, ...result } = user; // Renamed to avoid conflict
      return result;
    }

    // Add detailed debugging if password fails
    if (user) {
      const compareResult = await bcrypt.compare(trimmedPassword, user.password);
      console.log('🔐 Detailed comparison:', {
        compareResult,
        trimmedPasswordLength: trimmedPassword.length,
        storedHashLength: user.password.length,
        trimmedPassword: JSON.stringify(trimmedPassword)
      });
    }

    console.log('❌ Password validation failed');
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
      },
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    return this.login(user);
  }
}