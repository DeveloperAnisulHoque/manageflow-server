import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisConfig from '@common/config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
        });
      },
      inject: [ConfigService],
    },RedisService
  ],
  exports: ['REDIS_CLIENT',RedisService],
 
})
export class RedisModule {}
