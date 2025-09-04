import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ZarinpalService {
  constructor(private httpService: HttpService) {}

  async sendPaymentRequest(data: unknown) {
    this.httpService.post(process.env.ZARINPAL_REQUEST_URL, data);
  }

  async verifyPaymentRequest(data: unknown) {
    this.httpService.post(process.env.ZARINPAL_VERIFY_URL data);
  }
}
