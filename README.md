# Food Management App

A food delivery and management system built with NestJS, TypeScript, and PostgreSQL.

## Features

- User authentication with OTP verification
- Supplier registration and management
- Menu and category management
- Shopping cart functionality
- Payment processing with ZarinPal
- Order management system

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with OTP
- **File Storage**: AWS S3
- **Payment**: ZarinPal integration
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- AWS S3 account (for file storage)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm run migration:run

# Start development server
pnpm run start:dev
```

### Environment Variables

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=food_management

# JWT Secrets
JWT_USER_ACCESS_TOKEN_SECRET=your_user_access_secret
JWT_USER_REFRESH_TOKEN_SECRET=your_user_refresh_secret
JWT_SUPPLIER_ACCESS_TOKEN_SECRET=your_supplier_access_secret
JWT_SUPPLIER_REFRESH_TOKEN_SECRET=your_supplier_refresh_secret

# AWS S3
S3_BUCKET_NAME=your_bucket_name

# ZarinPal Payment Gateway
ZARINPAL_MERCHANT_ID=your_merchant_id
ZARINPAL_REQUEST_URL=https://api.zarinpal.com/pg/v4/payment/request.json
ZARINPAL_VERIFY_URL=https://api.zarinpal.com/pg/v4/payment/verify.json
ZARINPAL_GATEWAY_URL=https://www.zarinpal.com/pg/StartPay
PAYMENT_GATEWAY_URL=your_payment_callback_url

# Frontend
FRONTEND_URL=http://localhost:3001
```

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for the Swagger documentation.

## Project Structure

```
src/
├── common/           # Shared utilities, decorators, DTOs
├── modules/
│   ├── auth/         # Authentication
│   ├── user/         # User management
│   ├── supplier/     # Supplier management
│   ├── menu/         # Menu and categories
│   ├── basket/       # Shopping cart
│   ├── order/        # Order management
│   ├── payment/      # Payment processing
│   └── discount/     # Discount codes
├── configs/          # Configuration files
└── migrations/       # Database migrations
```

## Available Scripts

```bash
# Development
pnpm run start:dev

# Production
pnpm run start:prod

# Database
pnpm run migration:run
pnpm run migration:revert
pnpm run migration:generate

# Testing
pnpm run test
pnpm run test:e2e
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /send-otp` - Send OTP to user
- `POST /check-otp` - Verify user OTP

### Supplier Management (`/api/supplier`)

- `POST /signup` - Supplier registration
- `POST /send-otp` - Send OTP to supplier
- `POST /check-otp` - Verify supplier OTP
- `POST /supplementary-information` - Save additional information
- `PUT /upload-documents` - Upload supplier documents
- `PUT /upload-contract` - Upload contract

### Category Management (`/api/category`)

- `POST /` - Create category
- `GET /` - Get all categories (paginated)
- `GET /by-slug/:slug` - Get category by slug
- `PATCH /:id` - Update category
- `DELETE /:id` - Delete category

### Menu Management (`/api/menu`)

- `POST /` - Create menu item
- `PUT /:id` - Update menu item
- `GET /get-menu-by-supplier-id/:supplierId` - Get menus by supplier
- `GET /:id` - Get specific menu item
- `DELETE /:id` - Delete menu item

### Menu Group Management (`/api/menu-group`)

- `POST /` - Create menu group
- `GET /` - Get menu groups
- `GET /:id` - Get specific menu group
- `PUT /:id` - Update menu group
- `DELETE /:id` - Delete menu group

### Shopping Cart (`/api/basket`)

- `GET /` - Get basket contents
- `POST /` - Add item to basket
- `DELETE /` - Remove item from basket
- `POST /add-discount` - Apply discount code
- `DELETE /remove-discount` - Remove discount code

### Discount Management (`/api/discount`)

- `POST /` - Create discount
- `PUT /:code` - Update discount
- `DELETE /:code` - Delete discount
- `GET /` - Get all discounts (paginated)

### Payment (`/api/payment`)

- `POST /` - Initiate payment
- `GET /verify` - Verify payment

## Database Schema

The app uses the following main entities:

- Users (customers)
- Suppliers (restaurants)
- Categories
- Menus
- Orders
- Order Items
- Payments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
