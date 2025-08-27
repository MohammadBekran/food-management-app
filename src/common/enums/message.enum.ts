export enum EPublicMessages {
  CategoryCreatedSuccessfully = 'Category has been created successfully',
  CategoryUpdatedSuccessfully = 'Category has been updated successfully',
  CategoryDeletedSuccessfully = 'Category has been deleted successfully',
  MenuGroupCreatedSuccessfully = 'Menu group has been created successfully',
  MenuGroupUpdatedSuccessfully = 'Menu group has been updated successfully',
  MenuGroupDeletedSuccessfully = 'Menu group has been deleted successfully',
  DocumentUploadedSuccessfully = 'Document has been uploaded successfully',
  ContractUploadedSuccessfully = 'Contract has been uploaded successfully',
  OtpSentSuccessfully = 'Otp has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
  SupplementaryInformationSavedSuccessfully = 'Your supplementary information has been saves successfully',
}

export enum ENotBadRequestMessages {
  OtpCodeNotExpired = 'Otp code not expired',
}

export enum EConflictMessages {
  CategoryAlreadyExists = 'Category already exists',
  SupplierAlreadyExists = 'Supplier already exists',
  NationalCodeAlreadyUsed = 'National code already used by another person',
  EmailAlreadyUsed = 'Email already used by another person',
}

export enum ENotFoundMessages {
  CategoryNotFound = 'Category not found',
  AgentNotFound = 'Agent not found',
  MenuGroupNotFound = 'Menu group not found',
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
