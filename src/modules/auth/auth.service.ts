import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { jwtConstants, RoleEnum } from './constants/constants';
import { RolesService } from '../roles/roles.service';
import { SignUpResponseWithTokenDto } from './dto/sign-up-response.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<SignInResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles ? user.roles.map((role) => role.name) : [],
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiresIn,
      }),
    };
  }

  async register(signUpDto: SignUpDto): Promise<SignUpResponseWithTokenDto> {
    const { email, password } = signUpDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const userRole = await this.rolesService.findRoleByName(RoleEnum.USER);

    const newUser = await this.userService.create({
      email,
      passwordHash: hashPassword,
      roles: [userRole],
    });

    const payload = {
      email: newUser.email,
      sub: newUser.id,
      roles: newUser.roles.map((role) => role.name),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });

    const { passwordHash: _ } = newUser;

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles.map((role) => role.name),
    };

    return {
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    try {
      const user = await this.validateRefreshToken(refreshToken);
      const payload = this.createTokenPayload(user);
      return {
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles ? user.roles.map((role) => role.name) : [],
        },
        access_token: this.generateAccessToken(payload),
        refresh_token: this.generateRefreshToken(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateRefreshToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private createTokenPayload(user: User): any {
    return {
      email: user.email,
      sub: user.id,
      roles: user.roles ? user.roles.map((role) => role.name) : [],
    };
  }

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConstants.expiresIn,
    });
  }

  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });
  }
}
