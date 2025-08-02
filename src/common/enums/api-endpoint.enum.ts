export enum EApiEndpointNames {
  POSTUserSendOtp = 'send-otp',
  POSTUserCheckOtp = 'check-otp',
  POSTSupplierSignup = 'signup',
  POSTSupplierCheckOtp = 'check-otp',
  POSTSupplierSupplementaryInformation = 'supplementary-information',
  POSTCreateCategory = '',
  GETCategories = '',
  GETCategoryBySlug = 'by-slug/:slug',
  PATCHUpdateCategory = ':id',
  DELETECategory = ':id',
}
