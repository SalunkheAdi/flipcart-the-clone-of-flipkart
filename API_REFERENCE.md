# API Reference - Flipcart Clone

Complete API documentation for all endpoints.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-url/api
```

## Response Format

All responses are JSON with this structure:

```json
{
  "success": true/false,
  "data": {},
  "message": "Success message or error"
}
```

---

## Health Check

### Check Server Status
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

**Use Cases:**
- Verify backend is running
- Monitor uptime
- Load balancer checks

---

## Products Endpoints

### Get All Products

```http
GET /products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| search | string | Search by name/description |
| sort | string | Sort field: price, rating, newest |
| order | string | ASC or DESC |

**Examples:**

```bash
# Get all products
curl http://localhost:5000/api/products

# Get products from specific category
curl http://localhost:5000/api/products?category=mobiles

# Search products
curl http://localhost:5000/api/products?search=samsung

# Sort by price ascending
curl http://localhost:5000/api/products?sort=price&order=asc

# Combine filters
curl "http://localhost:5000/api/products?category=electronics&sort=rating&order=desc"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Samsung Galaxy S24 Ultra",
      "description": "Latest flagship smartphone...",
      "category": "mobiles",
      "price": 129999,
      "original_price": 149999,
      "discount_percentage": 13,
      "rating": 4.7,
      "reviews_count": 2341,
      "stock": 50,
      "image_url": "/images/samsung-s24.jpg",
      "specifications": "{\"processor\": \"Snapdragon 8 Gen 3\"}",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Product by ID

```http
GET /products/:id
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Product ID (required) |

**Example:**
```bash
curl http://localhost:5000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Samsung Galaxy S24 Ultra",
    "description": "Latest flagship smartphone...",
    "category": "mobiles",
    "price": 129999,
    "original_price": 149999,
    "discount_percentage": 13,
    "rating": 4.7,
    "reviews_count": 2341,
    "stock": 50,
    "image_url": "/images/samsung-s24.jpg",
    "specifications": "{...}",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Search Products

```http
GET /products/search
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| query | string | Search term (min 2 chars) |

**Example:**
```bash
curl "http://localhost:5000/api/products/search?query=samsung"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Samsung Galaxy S24 Ultra",
      "image_url": "/images/samsung-s24.jpg",
      "price": 129999,
      "rating": 4.7
    }
  ]
}
```

**Notes:**
- Returns max 10 results
- Only returns basic info (id, name, image, price, rating)
- Query must be at least 2 characters

---

### Get All Categories

```http
GET /products/categories
```

**Example:**
```bash
curl http://localhost:5000/api/products/categories
```

**Response:**
```json
{
  "success": true,
  "data": ["mobiles", "fashion", "electronics", "grocery"]
}
```

---

## Cart Endpoints

### Get Cart Items

```http
GET /cart
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| sessionId | string | User session ID (required) |

**Example:**
```bash
curl "http://localhost:5000/api/cart?sessionId=session_123456"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "quantity": 2,
      "name": "Sony Headphones",
      "price": 27999,
      "image_url": "/images/sony.jpg",
      "original_price": 34999,
      "discount_percentage": 20,
      "stock": 40
    }
  ]
}
```

---

### Add to Cart

```http
POST /cart
```

**Request Body:**
```json
{
  "productId": 5,
  "sessionId": "session_123456",
  "quantity": 1
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 5,
    "sessionId": "session_123456",
    "quantity": 1
  }'
```

**Response (New Item):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_id": 5,
    "quantity": 1,
    "session_id": "session_123456"
  },
  "message": "Added to cart"
}
```

**Response (Item Exists - Quantity Updated):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_id": 5,
    "quantity": 2,
    "session_id": "session_123456"
  },
  "message": "Added to cart"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Update Cart Item Quantity

```http
PUT /cart/:id
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Cart item ID (required) |

**Request Body:**
```json
{
  "quantity": 3
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

**Response (Quantity Updated):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_id": 5,
    "quantity": 3,
    "session_id": "session_123456"
  }
}
```

**Special Case - Remove Item (Quantity 0):**
```bash
curl -X PUT http://localhost:5000/api/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 0}'
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### Remove from Cart

```http
DELETE /cart/:id
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Cart item ID (required) |

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/cart/1
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### Clear Cart

```http
POST /cart/clear-cart
```

**Request Body:**
```json
{
  "sessionId": "session_123456"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/cart/clear-cart \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session_123456"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## Order Endpoints

### Create Order

```http
POST /orders
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "shippingAddress": "123 Main St, Apt 4B",
  "city": "New York",
  "postalCode": "10001",
  "state": "NY",
  "cartItems": [
    {
      "product_id": 5,
      "quantity": 2,
      "price": 27999
    }
  ],
  "totalAmount": 55998,
  "sessionId": "session_123456"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "shippingAddress": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "state": "NY",
    "cartItems": [{"product_id": 5, "quantity": 2, "price": 27999}],
    "totalAmount": 55998,
    "sessionId": "session_123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "FLP1705315000ABC123D",
    "orderDBId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "totalAmount": 55998
  },
  "message": "Order created successfully"
}
```

**Order ID Format:** `FLP[timestamp][UUID]`
- Example: `FLP1705315000ABC123D`

---

### Get Order Details

```http
GET /orders/:orderId
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| orderId | string/number | Order ID or DB ID (required) |

**Example:**
```bash
curl http://localhost:5000/api/orders/FLP1705315000ABC123D
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": "FLP1705315000ABC123D",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "9876543210",
    "shipping_address": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "state": "NY",
    "total_amount": 55998,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 5,
        "quantity": 2,
        "price": 27999,
        "name": "Sony Headphones",
        "image_url": "/images/sony.jpg"
      }
    ]
  }
}
```

---

### Get Orders by Email

```http
GET /orders/by-email
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| email | string | Customer email (required) |

**Example:**
```bash
curl "http://localhost:5000/api/orders/by-email?email=john@example.com"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_id": "FLP1705315000ABC123D",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "total_amount": 55998,
      "status": "pending",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Update Order Status

```http
PUT /orders/:orderId
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| orderId | string | Order ID (required) |

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

**Example:**
```bash
curl -X PUT http://localhost:5000/api/orders/FLP1705315000ABC123D \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": "FLP1705315000ABC123D",
    "status": "confirmed",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

## Error Handling

### Common Error Responses

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Error creating order"
}
```

---

## Rate Limiting

Currently no rate limiting. Recommended to add:
- 100 requests per minute per IP for GET
- 20 requests per minute per IP for POST/PUT/DELETE

---

## Authentication

Currently no authentication required. For production, implement:
- JWT tokens
- User registration/login
- Admin routes
- Protected endpoints

---

## CORS Configuration

```javascript
// Currently allows all origins
cors()

// Recommended for production
cors({
  origin: 'https://yourdomain.com',
  credentials: true
})
```

---

## Testing Endpoints

### Using cURL

```bash
# Get all products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "sessionId": "test", "quantity": 1}'

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Using Postman

1. Import collection (create in Postman)
2. Set base URL to http://localhost:5000/api
3. Test each endpoint

### Using REST Client (VS Code)

Create `requests.http`:
```http
### Get all products
GET http://localhost:5000/api/products

### Get specific product
GET http://localhost:5000/api/products/1

### Search products
GET http://localhost:5000/api/products/search?query=samsung

### Add to cart
POST http://localhost:5000/api/cart
Content-Type: application/json

{
  "productId": 1,
  "sessionId": "test_session",
  "quantity": 1
}

### Get cart
GET http://localhost:5000/api/cart?sessionId=test_session
```

---

## Data Types

| Type | Format | Example |
|------|--------|---------|
| ID | number | 1, 42, 1000 |
| Price | decimal | 1299.99, 59.50 |
| Percentage | number | 0-100 |
| Rating | decimal | 1.0-5.0 |
| URL | string | "/images/product.jpg" |
| Email | string | "user@example.com" |
| Phone | string | "9876543210" |
| Status | string | "pending", "confirmed", etc. |
| DateTime | ISO 8601 | "2024-01-15T10:30:00Z" |

---

## Pagination (Future Implementation)

Recommended to add pagination for large datasets:

```http
GET /products?page=1&limit=20
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Versioning

Currently v1 (implied). For future:

```http
GET /v2/products
```

---

## Webhooks (Future Implementation)

For order notifications:
```javascript
// POST to customer's webhook URL on status change
{
  "event": "order.updated",
  "orderId": "FLP...",
  "status": "shipped",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Support

For API issues:
1. Check this documentation
2. Review error messages
3. Check server logs
4. Verify request format
5. Test with cURL first

---

**Happy API development! 🚀**
