import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import roleSeedConfig from '@common/config/role-seed.config';
 
@Module({
  imports: [ConfigModule.forRoot({
     isGlobal: true,
      load: [roleSeedConfig],
  }),AuthModule, DatabaseModule, CommonModule, UserModule, RoleModule, ProjectModule, TaskModule],
})
export class AppModule {}

 