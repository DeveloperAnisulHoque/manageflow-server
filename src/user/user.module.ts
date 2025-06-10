import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from '@auth/auth.module';
import { RoleModule } from '@role/role.module';
import { FileStorageModule } from 'src/file-storage/file-storage.module';

@Module({
    imports: [RoleModule,forwardRef(()=>AuthModule),TypeOrmModule.forFeature([User]),FileStorageModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
