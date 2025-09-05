export interface IBasketFoodItem {
  foodId: string;
  name: string;
  description: string;
  count: number;
  image?: string;
  price: number;
  totalAmount: number;
  discountAmount: number;
  paymentAmount: number;
  discountCode?: string | null;
  supplierId: string;
  supplierName?: string;
}

export interface IGeneralDiscountDetail {
  code: string;
  percent: number;
  amount: number;
  paymentAmount: number;
}

export interface IGetBasketResponse {
  totalAmount: number;
  paymentAmount: number;
  totalDiscountAmount: number;
  foodList: IBasketFoodItem[];
  generalDiscountDetail: IGeneralDiscountDetail;
}
