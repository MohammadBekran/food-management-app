import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { SupplierAuthGuard } from 'src/modules/supplier/guards/supplier-auth.guard';

import { API_BEARER_AUTH } from '../constants/bearer-auth.constant';

export function UserAuth() {
  return applyDecorators(ApiBearerAuth(API_BEARER_AUTH), UseGuards(AuthGuard));
}

export function SupplierAuth() {
  return applyDecorators(
    ApiBearerAuth(API_BEARER_AUTH),
    UseGuards(SupplierAuthGuard),
  );
}
