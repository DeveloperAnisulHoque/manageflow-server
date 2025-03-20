import {  Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from 'src/common/config/database.config';
 
@Module({
    imports:[
     TypeOrmModule.forRootAsync({
       imports:[ConfigModule.forFeature(databaseConfig)],
       inject:[ConfigService],
       useFactory:(configService:ConfigService):TypeOrmModuleOptions=>({
               type:"postgres",
               url:configService.get<string>("database.url"),
               entities:[__dirname+"/../**/*.entity{.ts,.js}"],
               migrations: [__dirname + '/../migrations/*.{ts,js}'],
               synchronize: process.env.NODE_ENV !== 'production', // Disable in production
               migrationsRun: process.env.NODE_ENV !== 'production', // Run only in dev
               autoLoadEntities: true, // Ensures dynamic loading
 
       })
     })
    ],
    exports:[TypeOrmModule]
    
})
export class DatabaseModule {}
