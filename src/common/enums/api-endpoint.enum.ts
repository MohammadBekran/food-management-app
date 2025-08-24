export enum EApiEndpointNames {
  POSTUserSendOtp = 'send-otp',
  POSTUserCheckOtp = 'check-otp',
  POSTSupplierSignup = 'signup',
  POSTSupplierSendOtp = 'send-otp',
  POSTSupplierCheckOtp = 'check-otp',
  POSTSupplierSupplementaryInformation = 'supplementary-information',
  PUTUploadDocuments = 'upload-documents',
  POSTCreateCategory = '',
  GETCategories = '',
  GETCategoryBySlug = 'by-slug/:slug',
  PATCHUpdateCategory = ':id',
  DELETECategory = ':id',
}
