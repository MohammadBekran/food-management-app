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

| Method | Endpoint     | Description      | Auth Required |
| ------ | ------------ | ---------------- | ------------- |
| POST   | `/send-otp`  | Send OTP to user | ❌            |
| POST   | `/check-otp` | Verify user OTP  | ❌            |

### User Management (`/api/user`)

| Method | Endpoint         | Description                 | Auth Required |
| ------ | ---------------- | --------------------------- | ------------- |
| GET    | `/`              | Get user profile            | ✅ User       |
| PUT    | `/`              | Update user profile         | ✅ User       |
| GET    | `/my-orders`     | Get user orders (paginated) | ✅ User       |
| GET    | `/get-order/:id` | Get specific user order     | ✅ User       |

### User Address Management (`/api/user-address`)

| Method | Endpoint | Description               | Auth Required |
| ------ | -------- | ------------------------- | ------------- |
| GET    | `/`      | Get user addresses        | ✅ User       |
| POST   | `/`      | Create user address       | ✅ User       |
| GET    | `/:id`   | Get specific user address | ✅ User       |
| PUT    | `/:id`   | Update user address       | ✅ User       |
| DELETE | `/:id`   | Delete user address       | ✅ User       |

### Supplier Management (`/api/supplier`)

| Method | Endpoint                                | Description                     | Auth Required |
| ------ | --------------------------------------- | ------------------------------- | ------------- |
| POST   | `/signup`                               | Supplier registration           | ❌            |
| POST   | `/send-otp`                             | Send OTP to supplier            | ❌            |
| POST   | `/check-otp`                            | Verify supplier OTP             | ❌            |
| POST   | `/supplementary-information`            | Save additional information     | ✅ Supplier   |
| PUT    | `/upload-documents`                     | Upload supplier documents       | ✅ Supplier   |
| PUT    | `/upload-contract`                      | Upload contract                 | ✅ Supplier   |
| GET    | `/`                                     | Get supplier profile            | ✅ Supplier   |
| PUT    | `/`                                     | Update supplier profile         | ✅ Supplier   |
| GET    | `/get-orders`                           | Get supplier orders (paginated) | ✅ Supplier   |
| GET    | `/get-order/:id`                        | Get specific supplier order     | ✅ Supplier   |
| PUT    | `/orders/:orderId/items/:itemId/status` | Update order item status        | ✅ Supplier   |

### Category Management (`/api/category`)

| Method | Endpoint         | Description                    | Auth Required |
| ------ | ---------------- | ------------------------------ | ------------- |
| POST   | `/`              | Create category                | ✅ Supplier   |
| GET    | `/`              | Get all categories (paginated) | ❌            |
| GET    | `/by-slug/:slug` | Get category by slug           | ❌            |
| PATCH  | `/:id`           | Update category                | ✅ Supplier   |
| DELETE | `/:id`           | Delete category                | ✅ Supplier   |

### Menu Management (`/api/menu`)

| Method | Endpoint                               | Description            | Auth Required |
| ------ | -------------------------------------- | ---------------------- | ------------- |
| POST   | `/`                                    | Create menu item       | ✅ Supplier   |
| PUT    | `/:id`                                 | Update menu item       | ✅ Supplier   |
| GET    | `/get-menu-by-supplier-id/:supplierId` | Get menus by supplier  | ❌            |
| GET    | `/:id`                                 | Get specific menu item | ✅ Supplier   |
| DELETE | `/:id`                                 | Delete menu item       | ✅ Supplier   |

### Menu Group Management (`/api/menu-group`)

| Method | Endpoint | Description             | Auth Required |
| ------ | -------- | ----------------------- | ------------- |
| POST   | `/`      | Create menu group       | ✅ Supplier   |
| GET    | `/`      | Get menu groups         | ✅ Supplier   |
| GET    | `/:id`   | Get specific menu group | ✅ Supplier   |
| PUT    | `/:id`   | Update menu group       | ✅ Supplier   |
| DELETE | `/:id`   | Delete menu group       | ✅ Supplier   |

### Order Management (`/api/order`)

| Method | Endpoint      | Description                | Auth Required |
| ------ | ------------- | -------------------------- | ------------- |
| GET    | `/:id`        | Get specific order details | ✅ User       |
| PUT    | `/:id/cancel` | Cancel order               | ✅ User       |

### Shopping Cart (`/api/basket`)

| Method | Endpoint           | Description             | Auth Required |
| ------ | ------------------ | ----------------------- | ------------- |
| GET    | `/`                | Get basket contents     | ✅ User       |
| POST   | `/`                | Add item to basket      | ✅ User       |
| DELETE | `/`                | Remove item from basket | ✅ User       |
| POST   | `/add-discount`    | Apply discount code     | ✅ User       |
| DELETE | `/remove-discount` | Remove discount code    | ✅ User       |

### Discount Management (`/api/discount`)

| Method | Endpoint | Description                   | Auth Required |
| ------ | -------- | ----------------------------- | ------------- |
| POST   | `/`      | Create discount               | ✅ Admin      |
| PUT    | `/:code` | Update discount               | ✅ Admin      |
| DELETE | `/:code` | Delete discount               | ✅ Admin      |
| GET    | `/`      | Get all discounts (paginated) | ✅ Admin      |

### Payment (`/api/payment`)

| Method | Endpoint  | Description             | Auth Required |
| ------ | --------- | ----------------------- | ------------- |
| POST   | `/`       | Initiate payment        | ✅ User       |
| GET    | `/verify` | Verify payment callback | ❌            |

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
