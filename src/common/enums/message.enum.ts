export enum EPublicMessages {
  CategoryCreatedSuccessfully = 'Category has been created successfully',
  CategoryUpdatedSuccessfully = 'Category has been updated successfully',
  CategoryDeletedSuccessfully = 'Category has been deleted successfully',
  MenuCreatedSuccessfully = 'Menu has been created successfully',
  MenuUpdatedSuccessfully = 'Menu has been updated successfully',
  MenuDeletedSuccessfully = 'Menu has been deleted successfully',
  MenuGroupCreatedSuccessfully = 'Menu group has been created successfully',
  MenuGroupUpdatedSuccessfully = 'Menu group has been updated successfully',
  MenuGroupDeletedSuccessfully = 'Menu group has been deleted successfully',
  DocumentUploadedSuccessfully = 'Document has been uploaded successfully',
  ContractUploadedSuccessfully = 'Contract has been uploaded successfully',
  DiscountCreatedSuccessfully = 'Discount has been created successfully',
  DiscountUpdatedSuccessfully = 'Discount has been updated successfully',
  DiscountDeletedSuccessfully = 'Discount has been deleted successfully',
  OtpSentSuccessfully = 'Otp has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
  SupplementaryInformationSavedSuccessfully = 'Your supplementary information has been saves successfully',
}

export enum ENotBadRequestMessages {
  OtpCodeNotExpired = 'Otp code not expired',
  EnterOneOfTheAmountOrPercentFields = 'Enter one of the amount or percent fields',
}

export enum EConflictMessages {
  CategoryAlreadyExists = 'Category already exists',
  SupplierAlreadyExists = 'Supplier already exists',
  NationalCodeAlreadyUsed = 'National code already used by another person',
  EmailAlreadyUsed = 'Email already used by another person',
  DiscountAlreadyExists = 'Discount with this code already exists',
}

export enum ENotFoundMessages {
  CategoryNotFound = 'Category not found',
  AgentNotFound = 'Agent not found',
  MenuNotFound = 'Menu not found',
  MenuGroupNotFound = 'Menu group not found',
  DiscountNotFound = 'Discount not found',
}

export enum EAuthMessages {
  AccountNotFound = 'Account not found',
  InvalidCode = 'Code is invalid',
  CodeExpired = 'Code has been expired',
  LoginToAccount = 'Login to your account',
}

export enum EForbiddenMessages {
  CompleteSupplementaryInformation = 'First try to complete your supplementary information',
  UploadDocuments = 'To access this step, try to upload your documents',
}

export enum EValidationErrorMessages {
  InvalidPhoneNumber = 'Phone number is invalid',
  InvalidAuthCode = 'Code is invalid',
  InvalidEmail = 'Email is invalid',
}

export enum EInternalServerErrorException {
  UploadFileFailed = 'Upload file failed',
}
