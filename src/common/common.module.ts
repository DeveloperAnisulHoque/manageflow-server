import { Global, Module } from '@nestjs/common';
import { ValidIdPipe } from './pipe/valid-id-pipe';
import { SharedUserService } from './service/shared-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/entity/user.entity';
import { OwnershipService } from './service/ownership.service';
import { Project } from '@project/entity/project-entity';
  
@Global()
@Module({
    imports:[TypeOrmModule.forFeature([User,Project])],
    providers:[SharedUserService,ValidIdPipe,OwnershipService],
    exports:[ValidIdPipe,SharedUserService,OwnershipService],
})
export class CommonModule {}
