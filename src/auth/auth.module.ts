// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from '@common/config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
 import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalAuthGuard } from './guard/local-auth.guard';
 import { EmailModule } from 'src/email/email.module';
import { LocalStrategy } from './strategy/loacal.strategy';
 import { RefreshJwtStrategy } from './strategy/refresh.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule,
    JwtModule.register({}), // Default registration, tokens signed manually
    EmailModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    ConfigService,
    RefreshJwtStrategy,
    RefreshAuthGuard,
  ],
  exports: [JwtAuthGuard, AuthService,RefreshAuthGuard],
})
export class AuthModule {}
