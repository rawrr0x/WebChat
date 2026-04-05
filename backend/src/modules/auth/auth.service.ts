import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(email: string) {
    return {
      accessToken: await this.jwtService.signAsync(
        { email: email },
        {
          expiresIn: '15m',
          secret: this.configService.getOrThrow<string>(
            'JWT_ACCESS_SECRET_KEY',
          ),
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { email: email },
        {
          expiresIn: '7d',
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_SECRET_KEY',
          ),
        },
      ),
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (user) {
      const hash = await bcrypt.compare(dto.password, user.password);
      if (hash) {
        return user;
      }
    }

    throw new UnauthorizedException();
  }

  async register(dto: CreateUserDto) {
    const { email } = dto;
    await this.userService.create(dto);

    return this.generateTokens(email);
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    return this.generateTokens(user.email);
  }

  async refreshUserToken(token: string) {
    const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET_KEY'),
    });

    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.jwtService.signAsync(
      { email: payload.email },
      {
        expiresIn: '15m',
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET_KEY'),
      },
    );
  }
}
