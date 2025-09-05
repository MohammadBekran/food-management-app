export interface ISendPaymentRequestData {
  amount: number;
  description: string;
  user: {
    email: string;
    phone: string;
  };
}

export interface IVerifyPaymentRequestData {
  authority: string;
  amount: number;
}
