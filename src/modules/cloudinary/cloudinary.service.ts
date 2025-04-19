import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadLocalFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        { folder: 'restaurants' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
