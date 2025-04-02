import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() signInDto: SignInDto, @Req() req: Request) {
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );
    const tokens = await this.authService.login(user);
    return {
      ...tokens,
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    const user = await this.authService.validateRefreshToken(refreshToken);
    return this.authService.refreshToken(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return {
      message: 'Successfully logged out',
    };
  }
}
