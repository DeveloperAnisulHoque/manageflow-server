import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { ConfigType } from '@nestjs/config';
import cloudinaryConfig from '@common/config/cloudinary.config';
 
export const CloudinaryProvider = {
  provide: 'FILE_STORAGE',
  useFactory: (config: ConfigType<typeof cloudinaryConfig>) => {
    const configOptions: ConfigOptions = {
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    };

    cloudinary.config(configOptions);

    return cloudinary;
  },
  inject: [cloudinaryConfig.KEY],
};
