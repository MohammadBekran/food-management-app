import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';

import { EInternalServerErrorException } from 'src/common/enums/message.enum';

import type {
  ISendPaymentRequestData,
  IVerifyPaymentRequestData,
} from './interfaces/send-payment-request-data.interface';

@Injectable()
export class ZarinpalService {
  constructor(private httpService: HttpService) {}

  async sendPaymentRequest(data: ISendPaymentRequestData) {
    const { amount, description, user } = data;
    const paymentPayload = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      description,
      metadata: {
        email: user?.email ?? '',
        mobile: user?.phone ?? '',
      },
      callback_url: process.env.PAYMENT_GATEWAY_URL,
    };

    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_REQUEST_URL, paymentPayload)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((error) => {
            console.error(error.response.data);

            throw new InternalServerErrorException(
              EInternalServerErrorException.UnexpectedZarinpalError,
            );
          }),
        ),
    );

    const { authority, code } = result.data;
    if (code == 100 && authority) {
      return {
        code,
        authority,
        gatewayURL: `${process.env.ZARINPAL_GATEWAY_URL}/${authority}`,
      };
    }
  }

  async verifyPaymentRequest(data: IVerifyPaymentRequestData) {
    const { authority, amount } = data;
    const verifyPaymentPayload = {
      authority,
      amount,
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    };

    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_VERIFY_URL, verifyPaymentPayload)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((error) => {
            console.error(error);

            throw new InternalServerErrorException(
              EInternalServerErrorException.UnexpectedZarinpalError,
            );
          }),
        ),
    );

    return result;
  }
}
