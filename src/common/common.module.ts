import { Global, Module } from '@nestjs/common';
import { ValidIdPipe } from './pipe/valid-id-pipe';
 
@Global()
@Module({
    providers:[ValidIdPipe],
    exports:[ValidIdPipe],
})
export class CommonModule {}
