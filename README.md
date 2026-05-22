# IFN636_A2 Travel Booking Platform

A MERN travel booking application for browsing Australian tours, managing bookings, processing mock payments, and administering tours and orders.

## Demo Accounts

These accounts are for demo/testing only. Do not reuse these passwords in production.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `123456789` |
| User | `user01@gmail.com` | `123456789` |

## Main Features

### Public/User

- Register and login with JWT authentication.
- Browse available tours from the homepage.
- Search tours by title, location, or description.
- View tour detail pages with image gallery, price, description, notes, capacity, and reviews.
- Add tours to cart with tour date, quantity, and contact phone.
- Update cart item date, quantity, and contact details.
- Checkout cart into an order through a mock payment page.
- View personal bookings.
- Submit one review per purchased tour.
- Update user profile information.
- Receive in-app notification cards instead of browser alerts for many actions.

### Admin

- Access protected admin dashboard.
- View tour and order summary metrics.
- Create, edit, and delete tours.
- Upload tour cover images.
- Set tour type as `day` or `promo`.
- Automatically calculate promo final price from original price.
- View all orders.
- Open order details and update order status.
- Hide or show reviews through the review API.

## Tech Stack

- Frontend: React 18, React Router, Axios, Tailwind CSS, Create React App.
- Backend: Node.js, Express, MongoDB, Mongoose.
- Auth: JWT with protected routes and admin-only middleware.
- Uploads: Multer local uploads served from `/uploads`.
- Tests: Jest and Supertest for backend integration tests.

## Project Structure

```text
backend/
  config/          Database and upload/cloudinary configuration
  controllers/     Express request handlers
  facades/         Cart, order, and review orchestration
  middleware/      Auth and upload middleware
  models/          Mongoose schemas
  routes/          API route definitions
  strategies/      Pricing and review eligibility strategies
  test/            Backend API tests
frontend/
  src/components/  Shared UI components
  src/context/     Auth, cart, and notification contexts
  src/layouts/     Public, auth, and admin layouts
  src/pages/       Public, user, and admin pages
  src/utils/       Image/cart helper utilities
```

## Workflow

### User Flow

1. Open homepage.
2. Search or browse tours.
3. Open tour details.
4. Login or register.
5. Add tour to cart with date, guest quantity, and phone number.
6. Confirm cart details.
7. Complete mock payment.
8. View booking in My Bookings.
9. Submit a review after purchase.

### Admin Flow

1. Login with admin account.
2. Open admin dashboard.
3. Manage tours from the Tours page.
4. Create/edit/delete tours and upload cover images.
5. View orders from the Orders page.
6. Open order details and update order status.

## Data Model Summary

### User

- `username`
- `email`
- `password`
- `phone`
- `university`
- `address`
- `role`: `user` or `admin`

### Tour

- `title`
- `location`
- `originalPrice`
- `price`
- `imageUrl`
- `status`
- `type`: `day` or `promo`
- `startDate`
- `endDate`
- `description`
- `importantNotes`
- `capacity`

Promo tours automatically set `price` to 90% of `originalPrice`.

### Cart

- One cart per user.
- Items contain tour, quantity, tour date, and personal contact info.

### Order

- Created from the current cart.
- Stores order items, unit price, total price, total amount, order status, and payment status.

### Review

- Linked to user, tour, and order.
- Only users who purchased a tour can review it.
- One review per user per tour.
- Review status can be `Visible` or `Hidden`.

## API Overview

### Auth

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/profile` | User | Get profile |
| PUT | `/api/auth/profile` | User | Update profile |

### Tours

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/tours` | Public | List tours |
| GET | `/api/tours?search=keyword` | Public | Search tours |
| GET | `/api/tours/:id` | Public | Get tour detail |
| POST | `/api/tours` | Admin | Create tour |
| PUT | `/api/tours/:id` | Admin | Update tour |
| DELETE | `/api/tours/:id` | Admin | Delete tour |

Search currently performs case-insensitive continuous phrase matching across title, location, and description. For example, `sydney harbour` matches `Sydney Harbour Cruise`, but `sydney cruise` does not match across the missing word.

### Cart

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add item |
| PATCH | `/api/cart/update` | User | Update item |
| DELETE | `/api/cart/:cartItemId` | User | Remove item |
| DELETE | `/api/cart` | User | Clear cart |

### Orders

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/orders` | User | Checkout cart |
| GET | `/api/orders/my` | User | Get my orders |
| GET | `/api/orders/all` | Admin | Get all orders |
| GET | `/api/orders/:id` | User/Admin | Get order by id |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

### Reviews

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/reviews` | User | Create review |
| GET | `/api/reviews/tour/:tourId` | Public | Get reviews for a tour |
| GET | `/api/reviews/my/:tourId` | User | Get my review for a tour |
| PUT | `/api/reviews/:id` | User | Update own review |
| PATCH | `/api/reviews/:id/status` | Admin | Hide/show review |

## Design Patterns

### MVC

The backend follows a practical MVC structure:

- Models: Mongoose schemas in `backend/models`.
- Views: React frontend in `frontend/src`.
- Controllers: Express handlers in `backend/controllers`.

### Singleton

Database connection is centralized through `backend/config/db.js`.

### Facade

Implemented in:

- `backend/facades/cartFacade.js`
- `backend/facades/orderFacade.js`
- `backend/facades/reviewFacade.js`

These facades keep controller methods thinner and hide multi-step business logic.

### Strategy

Implemented in:

- `backend/strategies/pricingStrategy.js`
- `backend/strategies/reviewEligibilityStrategy.js`

Pricing and review eligibility logic are separated from controllers and facades.

### Observer-Style State Updates

The frontend uses React Context state updates for cart and notification state:

- `frontend/src/context/cartContext.js`
- `frontend/src/context/NotificationContext.js`

## Setup

### Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

### Backend Environment

Create `backend/.env` with:

```text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Optional Cloudinary values exist in the codebase, but the active tour route currently uses local Multer uploads.

```text
CLOUDINARY_CLOUD_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```

### Run the Application

Start the backend server:

```bash
cd backend
npm start
```

Start the frontend app in another terminal:

```bash
cd frontend
npm start
```

Backend default:

```text
http://localhost:5001
```

Frontend default:

```text
http://localhost:3000
```

### Production API URL

The frontend production API base URL is currently configured in `frontend/src/axiosConfig.jsx`:

```text
http://15.135.232.0:5001
```

## Testing

### Backend

```bash
cd backend
npm test
```

Coverage includes order APIs, review APIs, and tour search behavior.

### Frontend Build

```bash
cd frontend
npm run build
```

### Frontend Tests

```bash
cd frontend
npm test -- --watchAll=false
```

## Known Limitations

- Payment is a mock checkout flow. It creates an order but does not process real card payments.
- Tour search is phrase-based, not token-based.
- Tour gallery currently repeats the primary tour image rather than storing multiple image records.
