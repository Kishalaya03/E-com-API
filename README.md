# 🛒 E-Commerce REST API

A fully-featured RESTful API for an e-commerce application built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**. It supports user authentication, product management, cart operations, order handling, likes, and product ratings — with JWT-based security and Swagger API documentation.

---

## 🚀 Features

- JWT-based authentication and authorization
- User signup, signin, and password reset
- Product listing, filtering, and rating system
- Shopping cart management with upsert and quantity tracking
- Order management
- Product like/unlike functionality
- Auto-seeded product categories on startup
- MongoDB indexes for optimized querying
- Winston-based request logging
- Swagger UI for API exploration
- CORS configured for frontend integration
- Centralized error handling

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose 8 |
| Authentication | JWT (`jsonwebtoken`) + `bcrypt` |
| Validation | `express-validator` |
| File Uploads | `multer` |
| Logging | `winston` |
| API Docs | Swagger UI (`swagger-ui-express`) |
| Config | `dotenv` |

---

## 📂 Project Structure

```
e-com-api/
│
├── server.js                          # App entry point
├── swagger.json                       # OpenAPI 3.0 spec
├── package.json
├── .env                               # Environment variables
│
└── src/
    ├── config/
    │   ├── mongodb.js                 # Native MongoDB client + indexes + counter
    │   └── mongooseConfig.js          # Mongoose connection + category seeding
    │
    ├── error-handler/
    │   └── applicationError.js        # Custom error class
    │
    ├── middlewares/
    │   ├── jwt.middleware.js          # JWT verification middleware
    │   ├── winston.middleware.js      # Request logging middleware
    │   └── basicAuth.middleware.js    # (Legacy) Basic auth middleware
    │
    └── features/
        ├── product/
        │   ├── product.model.js
        │   ├── product.schema.js
        │   ├── product.repository.js
        │   ├── product.routes.js
        │   ├── product.controller.js
        │   ├── category.schema.js
        │   └── review.schema.js
        │
        ├── user/
        │   ├── user.model.js
        │   ├── user.schema.js
        │   ├── user.repository.js
        │   ├── user.routes.js
        │   └── user.controller.js
        │
        ├── cartitems/
        │   ├── cartitems.model.js
        │   ├── cartitems.schema.js
        │   ├── cartitems.repository.js
        │   ├── cartitems.routes.js
        │   └── cartitems.controller.js
        │
        ├── order/
        │   └── order.routes.js
        │
        └── like/
            └── like.routes.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/e-com-api.git
cd e-com-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecomdb
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the server

```bash
node server.js
```

The server will start at:

```
http://localhost:3200
```

---

## 📖 API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3200/api-docs
```

---

## 🔌 API Endpoints

### 👤 Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ❌ | Register a new user |
| POST | `/signin` | ❌ | Login and receive JWT token |
| PUT | `/resetPassword` | ✅ JWT | Reset authenticated user's password |

**Signup payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Pass@1234",
  "type": "customer"
}
```

> Password rules: 8–12 characters, must contain at least one special character.  
> User types: `customer` or `seller`

---

### 📦 Products — `/api/products`

> All routes require JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all products |
| POST | `/` | Add a new product |
| GET | `/:id` | Get a single product by ID |
| GET | `/filter` | Filter by `minPrice`, `maxPrice`, `category` |
| POST | `/rate/:id` | Rate a product (1–5) |

---

### 🛒 Cart — `/api/cart`

> All routes require JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Add item to cart (upserts quantity) |
| GET | `/` | Get all cart items for authenticated user |
| DELETE | `/:id` | Remove a cart item by ID |

**Add to cart payload:**
```json
{
  "productID": "abc123",
  "quantity": 2
}
```

---

### 📋 Orders — `/api/order`

> Requires JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| (See Swagger) | `/api/order` | Order management routes |

---

### ❤️ Likes — `/api/likes`

> Requires JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| (See Swagger) | `/api/likes` | Like/unlike products |

---

## 🔐 Authentication

This API uses **JWT Bearer tokens**. After signing in, include the token in all protected requests:

```
Authorization: Bearer <your_token>
```

Tokens expire after **1 hour**.

---

## 🗄️ Database

### MongoDB Indexes (auto-created on startup)

| Collection | Index Type | Fields |
|---|---|---|
| products | Single | `price` (ASC) |
| products | Compound | `name` (ASC), `category` (DESC) |
| products | Text | `desc` |

### Auto-seeded Categories

On first startup, the following categories are seeded automatically if none exist:

- Books
- Clothing
- Electronics

### Cart Item Counter

A `counters` collection tracks incrementing IDs for cart items using MongoDB's `findOneAndUpdate` with `$inc`.

---

## 📐 Data Schemas

### User

| Field | Type | Constraints |
|---|---|---|
| `name` | String | — |
| `email` | String | Unique, valid email format |
| `password` | String | 8–12 chars, 1+ special character, bcrypt-hashed |
| `typeofuser` | String | Enum: `customer`, `seller` |

### Product

| Field | Type | Notes |
|---|---|---|
| `name` | String | — |
| `description` | String | — |
| `category` | String | — |
| `price` | Number | — |
| `inStock` | Number | — |
| `reviews` | ObjectId[] | Ref: `Review` |
| `categories` | ObjectId[] | Ref: `Category` |

### Cart Item

| Field | Type | Notes |
|---|---|---|
| `productID` | ObjectId | Ref: `product` |
| `userID` | ObjectId | Ref: `User` |
| `quantity` | Number | Incremented on upsert |

### Review

| Field | Type | Notes |
|---|---|---|
| `product` | ObjectId | Ref: `product` |
| `user` | ObjectId | Ref: `User` |
| `rating` | Number | — |

---

## 🛠️ Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.1.0 | Web framework |
| `mongoose` | ^8.17.1 | MongoDB ODM |
| `mongodb` | ^6.18.0 | Native MongoDB driver |
| `jsonwebtoken` | ^9.0.2 | JWT auth |
| `bcrypt` | ^6.0.0 | Password hashing |
| `dotenv` | ^17.2.1 | Environment config |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `multer` | ^2.0.1 | File/image uploads |
| `swagger-ui-express` | ^5.0.1 | Swagger API docs UI |
| `winston` | ^3.17.0 | Logging |
| `express-validator` | ^7.2.1 | Input validation |
| `body-parser` | ^2.2.0 | Request body parsing |

---

## 👨‍💻 Author

**Kishalaya Chattopadhyay**  
B.Tech Computer Science Student | Frontend Developer | AI/ML Enthusiast
