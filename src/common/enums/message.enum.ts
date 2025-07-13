export enum EPublicMessages {
  CategoryCreatedSuccessfully = 'Category has been created successfully',
  CategoryUpdatedSuccessfully = 'Category has been updated successfully',
  CategoryDeletedSuccessfully = 'Category has been deleted successfully',
  OtpSentSuccessfully = 'Otp has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
}

export enum ENotBadRequestMessages {
  OtpCodeNotExpired = 'Otp code not expired',
}

export enum EConflictMessages {
  CategoryAlreadyExists = 'Category already exists',
}

export enum ENotFoundMessages {
  CategoryNotFound = 'Category not found',
}

export enum ENotAuthMessages {
  AccountNotFound = 'Account not found',
  InvalidCode = 'Code is invalid',
  CodeExpired = 'Code has been expired',
  LoginToAccount = 'Login to your account',
}

export enum EForbiddenMessages {}

export enum EValidationErrorMessages {
  InvalidPhoneNumber = 'Phone number is invalid',
  InvalidAuthCode = 'Code is invalid',
  InvalidEmail = 'Email is invalid',
}
