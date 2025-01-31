import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import * as tus from 'tus-js-client';

/**
 * Service for handling file uploads using the TUS protocol.
 * This service provides functionality to upload files to a specified TUS endpoint
 * with retry mechanisms, progress tracking, and error handling.
 */
@Injectable()
export class tusTestService {
  /**
   * Uploads a file to the specified URL using the TUS protocol with retry capabilities.
   *
   * @param {string} filePath - The local file path to be uploaded.
   * @param {string} uploadUrl - The endpoint URL where the file will be uploaded.
   * @return {Promise<void>} A promise that resolves when the upload is completed successfully, or rejects with an error if the upload fails.
   */
  async uploadFile(filePath: string, uploadUrl: string): Promise<unknown> {
    return new Promise<void>((resolve, reject) => {
      const file = fs.createReadStream(filePath);
      const fileSize = fs.statSync(filePath).size;

      const options: tus.UploadOptions = {
        endpoint: uploadUrl,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
          filename: filePath.split('/').pop() || 'file',
          filetype: 'application/octet-stream',
        },
        uploadSize: fileSize,
        onError: (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Upload Progress: ${percentage}%`);
        },
        onSuccess: (value) => {
          console.log('Upload completed successfully.');
          console.log(value.lastResponse.getBody());
          resolve();
        },
      };

      const upload = new tus.Upload(file, options);
      upload.start();
    });
  }
}
