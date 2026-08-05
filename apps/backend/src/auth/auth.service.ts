import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(signupDto: SignupDto) {
    const existing = await this.usersService.findOneByEmail(signupDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(signupDto.password, salt);
    
    const user = await this.usersService.createUser({
      email: signupDto.email,
      passwordHash,
      name: signupDto.name,
      phone: signupDto.phone,
      role: signupDto.role || 'renter',
    });

    const { passwordHash: _, ...result } = user;
    const payload = { email: result.email, sub: result.id, role: result.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
}
