export interface ISendPaymentRequestData {
  amount: number;
  description: string;
  user: {
    email: string;
    mobile: string;
  };
  callback_url: string;
}
