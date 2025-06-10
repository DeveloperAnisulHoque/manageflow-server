import { Inject, Injectable } from '@nestjs/common';
import { FileUploadResponse } from './interfaces/file-upload.interface';

@Injectable()
export class FileStorageService {
  constructor(@Inject('FILE_STORAGE') private fileStorageProvider: any) {}

  async upload(file: Express.Multer.File): Promise<FileUploadResponse> {
    return new Promise((resolve, reject) => {
      this.fileStorageProvider.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      ).end(file.buffer);
    });
  }

  async delete(fileUrlOrPublicId: string): Promise<void> {
    const publicId = this.extractPublicId(fileUrlOrPublicId);
    if (!publicId) throw new Error('Invalid public ID or URL provided');
    await this.fileStorageProvider.uploader.destroy(publicId);
  }

  private extractPublicId(fileUrlOrPublicId: string): string | null {
  if (!fileUrlOrPublicId) return null;

  // If it's already a publicId
  if (!fileUrlOrPublicId.includes('http')) return fileUrlOrPublicId;

  try {
    const urlParts = fileUrlOrPublicId.split('/');
    const filenameWithExt = urlParts[urlParts.length - 1];
    const publicIdWithFolder = urlParts.slice(urlParts.indexOf('upload') + 1).join('/');

    // Remove version and file extension
    const versionRegex = /^v\d+$/;
    const parts = publicIdWithFolder.split('/');
    const filteredParts = parts.filter(p => !versionRegex.test(p));
    const lastPart = filteredParts.pop();
    const filename = lastPart?.split('.')[0];
    if (!filename) return null;

    return [...filteredParts, filename].join('/');
  } catch {
    return null;
  }
}

}
