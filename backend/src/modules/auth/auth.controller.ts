import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from 'src/common/constants';
import { JwtCookieRequest } from '../../common/interfaces/jwt-cookie-request.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { setTokenToCookies } from 'src/common/utils/set-token-to-cookies.util';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User have been created' })
  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    setTokenToCookies(res, 'accessToken', accessToken, ACCESS_TOKEN_MAX_AGE);
    setTokenToCookies(res, 'refreshToken', refreshToken, REFRESH_TOKEN_MAX_AGE);

    return 'ok';
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, description: 'User have been logged in' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    setTokenToCookies(res, 'accessToken', accessToken, ACCESS_TOKEN_MAX_AGE);
    setTokenToCookies(res, 'refreshToken', refreshToken, REFRESH_TOKEN_MAX_AGE);

    return 'ok';
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'User have been logged out' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return 'ok';
  }

  @ApiOperation({ summary: 'Access token refresh' })
  @ApiResponse({
    status: 201,
    description: 'User`s access jwt token have been refreshed',
  })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as JwtCookieRequest;
    const token = cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException();
    }

    const newAccessToken = await this.authService.refreshUserToken(token);

    setTokenToCookies(res, 'accessToken', newAccessToken, ACCESS_TOKEN_MAX_AGE);

    return 'ok';
  }
}
