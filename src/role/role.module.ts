import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { PermissionGuard } from './guard/permission.guard';
import roleSeedConfig from '@common/config/role-seed.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        TypeOrmModule.forFeature([Role]),ConfigModule.forFeature(roleSeedConfig)
    ],
    controllers:[RoleController],
    providers:[RoleService,PermissionGuard],
    exports:[RoleService,PermissionGuard]
})
export class RoleModule {}
