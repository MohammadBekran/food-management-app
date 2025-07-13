import {
  applyDecorators,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

import type { IValidatedImageFileOptions } from '../interfaces/validated-image-file-options.interface';
import { ALLOWED_FILE_TYPES_TO_UPLOAD } from '../constants/allowed-file-types.constant';

export function ValidatedImageFile(options: IValidatedImageFileOptions = {}) {
  const {
    name = 'file',
    maxSizeMB = 1,
    fileTypes = ALLOWED_FILE_TYPES_TO_UPLOAD,
  } = options;

  const convertedFileTypes = fileTypes.map((fileType, index) => {
    const isLast = fileTypes.length === index;

    return `${fileType}${!isLast && '|'}`;
  });

  const validators = [
    new MaxFileSizeValidator({
      maxSize: maxSizeMB * 1024 * 1024,
    }),
    new FileTypeValidator({
      fileType: `image/(${convertedFileTypes})`,
    }),
  ];

  return UploadedFile(name, new ParseFilePipe({ validators }));
}
