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
import { UserResponseDto } from '../users/dto/user-response.dto';
import { jwtConstants, RoleEnum } from './constants/constants';
import { RolesService } from '../roles/roles.service';
import { SignUpResponseWithTokenDto } from './dto/sign-up-response.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

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

    const { passwordHash: _ } = newUser;
    return {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles.map((role) => role.name),
      access_token: accessToken,
    };
  }

  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((role) => role.name),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateRefreshToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });
      return await this.userService.findOne(payload.sub);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
