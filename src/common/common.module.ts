import { Global, Module } from '@nestjs/common';
import { ValidIdPipe } from './pipe/valid-id-pipe';
import { SharedUserService } from './service/shared-user-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/entity/user.entity';
  
@Global()
@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[SharedUserService,ValidIdPipe],
    exports:[ValidIdPipe,SharedUserService],
})
export class CommonModule {}
