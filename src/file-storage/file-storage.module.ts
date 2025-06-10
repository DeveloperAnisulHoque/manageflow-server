import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStorageService } from './file-storage.service';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import cloudinaryConfig from '@common/config/cloudinary.config';

@Module({
  imports: [ConfigModule,ConfigModule.forFeature(cloudinaryConfig)],
  providers: [
    FileStorageService,
    CloudinaryProvider,  
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
