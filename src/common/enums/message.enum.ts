export enum EPublicMessages {
  AddressCreatedSuccessfully = 'Address has been created successfully',
  AddressUpdatedSuccessfully = 'Address has been updated successfully',
  AddressDeletedSuccessfully = 'Address has been deleted successfully',
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
  DiscountAddedSuccessfully = 'Discount has been added successfully',
  PaymentDoneSuccessfully = 'Payment has been done successfully',
  OtpSentSuccessfully = 'Otp has been sent successfully',
  LoggedInSuccessfully = 'Logged in successfully',
  SupplementaryInformationSavedSuccessfully = 'Your supplementary information has been saves successfully',
  FoodAddedToBasket = 'Food has been added to your basket successfully',
  FoodRemovedFromBasket = 'Food has been removed from your basket successfully',
}

export enum EBadRequestMessages {
  OtpCodeNotExpired = 'Otp code not expired',
  EnterOneOfTheAmountOrPercentFields = 'Enter one of the amount or percent fields',
  BasketNotFound = 'Basket not found',
  CannotUseThisDiscountCode = 'You cannot use this discount code',
  CannotUseDiscountMultipleTimes = 'You cannot use a discount code multiple times',
  CannotUseGeneralDiscountMultipleTimes = 'You cannot use a general discount code multiple times',
  DiscountIsNotActive = 'Discount is not active',
  OutOfDiscountCapacity = 'Out of discount capacity',
  DiscountIsExpired = 'Discount is expired',
  FoodListIsEmpty = 'Your food list is empty',
}

export enum EConflictMessages {
  CategoryAlreadyExists = 'Category already exists',
  SupplierAlreadyExists = 'Supplier already exists',
  NationalCodeAlreadyUsed = 'National code already used by another person',
  EmailAlreadyUsed = 'Email already used by another person',
  DiscountAlreadyExists = 'Discount with this code already exists',
  PaymentAlreadyVerified = 'Payment already verified',
}

export enum ENotFoundMessages {
  UserNotFound = 'User not found',
  CategoryNotFound = 'Category not found',
  AgentNotFound = 'Agent not found',
  MenuNotFound = 'Menu not found',
  MenuGroupNotFound = 'Menu group not found',
  DiscountNotFound = 'Discount not found',
  AddressNotFound = 'Address not found',
  PaymentNotFound = 'Payment not found',
  OrderNotFound = 'Order not found',
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
  UnexpectedZarinpalError = 'Unexpected Zarinpal error',
}
