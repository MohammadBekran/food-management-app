import { NestInterceptor, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export const UploadFileS3 = (fieldName: string): Type<NestInterceptor> => {
  return class UploadUtility extends FileInterceptor(fieldName, {
    storage: memoryStorage(),
  }) {};
};
