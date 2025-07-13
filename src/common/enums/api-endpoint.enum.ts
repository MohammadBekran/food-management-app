export enum EApiEndpointNames {
  POSTSendOtp = 'send-otp',
  POSTCheckOtp = 'check-otp',
  POSTCreateCategory = '',
  GETCategories = '',
  GETCategoryBySlug = 'by-slug/:slug',
  PATCHUpdateCategory = ':id',
  DELETECategory = ':id',
}
