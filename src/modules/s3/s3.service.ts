import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor() {
    const { S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT } = process.env;

    this.s3 = new S3({
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
      endpoint: S3_ENDPOINT,
      region: 'default',
    });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File, folderName: string) {
    const fileExtension = extname(file.originalname);
    const fileName = `${folderName}/${Date.now()}${fileExtension}`;

    const result = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
      })
      .promise();

    return result.Location;
  }

  async deleteFile(key: string) {
    const result = await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: decodeURI(key),
      })
      .promise();

    return result;
  }
}
