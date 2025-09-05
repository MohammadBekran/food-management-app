namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    PAYMENT_GATEWAY_URL: string;
    FRONTEND_URL: string;

    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;

    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT: string;

    JWT_USER_ACCESS_TOKEN_SECRET: string;
    JWT_USER_REFRESH_TOKEN_SECRET: string;
    JWT_SUPPLIER_ACCESS_TOKEN_SECRET: string;
    JWT_SUPPLIER_REFRESH_TOKEN_SECRET: string;

    ZARINPAL_REQUEST_URL: string;
    ZARINPAL_VERIFY_URL: string;
    ZARINPAL_GATEWAY_URL: string;
    ZARINPAL_MERCHANT_ID: string;
  }
}
