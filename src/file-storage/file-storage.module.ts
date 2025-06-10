import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStorageService } from './file-storage.service';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    FileStorageService,
    CloudinaryProvider,  
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
