import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategies';
import { JwtStrategy } from './strategies/jwt.strategies';
import { roleProviders } from '../roles/role.providers';
import { userProviders } from '../users/user.provider';
import { DatabaseModule } from 'src/database/database.module';
import { RolesModule } from '../roles/roles.module';
import { jwtConstants } from './constants/constants';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...userProviders,
    ...roleProviders,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
