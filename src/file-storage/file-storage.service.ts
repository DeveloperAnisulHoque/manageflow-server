import { Inject, Injectable } from '@nestjs/common';
import { FileUploadResponse } from './interfaces/file-upload.interface';

/**
 * FileStorageService provides an abstraction layer for file storage operations
 * using a cloud-based file storage provider (e.g., Cloudinary, S3).
 * Handles both file uploads and deletions with proper error handling.
 */
@Injectable()
export class FileStorageService {
  constructor(
    @Inject('FILE_STORAGE') 
    private readonly fileStorageProvider: any // Abstracted storage provider interface
  ) {}

  /**
   * Uploads a file to the cloud storage provider
   * @param file - The file to upload (Express.Multer.File)
   * @returns Promise<FileUploadResponse> - Contains URL and public ID of the uploaded file
   * @throws Error if the upload fails
   * 
   * @example
   * const result = await fileStorageService.upload(file);
   * console.log(result.url); // Access the uploaded file URL
   */
  async upload(file: Express.Multer.File): Promise<FileUploadResponse> {
    return new Promise((resolve, reject) => {
      this.fileStorageProvider.uploader.upload_stream(
        { folder: 'uploads' }, // Configuration for upload destination
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,    // HTTPS URL of the uploaded file
            publicId: result.public_id, // Unique identifier for the file in storage
          });
        },
      ).end(file.buffer); // Stream the file buffer to the uploader
    });
  }

  /**
   * Deletes a file from cloud storage using either its URL or public ID
   * @param fileUrlOrPublicId - Either the full file URL or its public ID
   * @returns Promise<void>
   * @throws Error if the deletion fails or invalid ID/URL is provided
   * 
   * @example
   * await fileStorageService.delete('https://res.cloudinary.com/.../sample.jpg');
   * await fileStorageService.delete('uploads/sample');
   */
  async delete(fileUrlOrPublicId: string): Promise<void> {
    const publicId = this.extractPublicId(fileUrlOrPublicId);
    if (!publicId) throw new Error('Invalid public ID or URL provided');
    await this.fileStorageProvider.uploader.destroy(publicId);
  }

  /**
   * Extracts the public ID from either a storage URL or raw public ID
   * @param fileUrlOrPublicId - Either the full file URL or public ID
   * @returns string | null - The extracted public ID or null if invalid
   * 
   * @private
   * @note Handles URLs with version numbers and file extensions
   */
  private extractPublicId(fileUrlOrPublicId: string): string | null {
    if (!fileUrlOrPublicId) return null;

    // If input is already a public ID (not a URL)
    if (!fileUrlOrPublicId.includes('http')) return fileUrlOrPublicId;

    try {
      const urlParts = fileUrlOrPublicId.split('/');
      const publicIdWithFolder = urlParts.slice(urlParts.indexOf('upload') + 1).join('/');

      // Remove version numbers (v123) and file extensions
      const versionRegex = /^v\d+$/;
      const parts = publicIdWithFolder.split('/');
      const filteredParts = parts.filter(p => !versionRegex.test(p));
      const lastPart = filteredParts.pop();
      const filename = lastPart?.split('.')[0]; // Remove file extension
      if (!filename) return null;

      return [...filteredParts, filename].join('/');
    } catch {
      return null; // Gracefully handle malformed URLs
    }
  }
}