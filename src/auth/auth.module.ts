import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from '@common/config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/loacal.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard copy';

@Module({
    imports:[
        ConfigModule.forFeature(authConfig),
        PassportModule,
        JwtModule.registerAsync({
            imports:[ConfigModule.forFeature(authConfig)],
            useFactory:async (configService:ConfigService)=>({
                secret:configService.get<string>("auth.jwtSecret"),
                signOptions:{
                    expiresIn:configService.get<string>("auth.jwtExpiration")
                }
            }),
            inject:[ConfigService]
        }),
        UserModule],
    controllers:[AuthController],
    providers:[AuthService,LocalStrategy,JwtStrategy,LocalAuthGuard,JwtAuthGuard],
    exports:[JwtAuthGuard]
})
export class AuthModule {}
