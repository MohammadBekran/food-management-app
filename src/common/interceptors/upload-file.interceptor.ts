import { NestInterceptor, Type } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import type { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const UploadFileS3 = (fieldName: string): Type<NestInterceptor> => {
  return class UploadUtility extends FileInterceptor(fieldName, {
    storage: memoryStorage(),
  }) {};
};

export const UploadFileFieldsS3 = (
  uploadFields: MulterField[],
): Type<NestInterceptor> => {
  return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
    storage: memoryStorage(),
  }) {};
};
