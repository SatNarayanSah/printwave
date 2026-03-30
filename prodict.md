# Product Management API Endpoints

**Project**: Janakpur Custom Printed T-Shirt E-Commerce  
**Database**: PostgreSQL with TypeORM  
**Backend**: Node.js  
**Frontend**: Next.js 15 + Tailwind CSS  
**Version**: 1.0  
**Date**: March 2026

---

## 1. Overview

This document contains **all API endpoints** related to Product management for the online t-shirt business.  
It includes public endpoints for customers and protected admin endpoints.

**Key Tables in PostgreSQL**:
- Products
- Product Variants (colors)
- Product Sizes (stock per size)
- Reviews

**Roles**:
- Guest: View only
- User: View + Submit reviews
- Admin: Full CRUD operations

All admin endpoints require JWT authentication + admin role.

---

## 2. Public Endpoints (No Authentication Required)

### GET /api/products
**Description**: Fetch list of active products for the Shop page.  
**Features**:
- Filter by category (MITHILA, FESTIVAL, FUNNY, CUSTOM, GENERAL)
- Filter by price range (minPrice, maxPrice)
- Filter by size (S, M, L, XL, XXL) — only shows products with stock > 0
- Search by product name
- Sort options: price_asc, price_desc, newest, popularity
- Pagination (page, limit)
- Returns product id, name, slug, basePrice, images, category, averageRating

**Used In**: Shop / Product Listing Page

### GET /api/products/featured
**Description**: Get featured products for homepage.  
**Features**:
- Limited number of products (default: 8)
- Returns high-quality images and basic info
- Only active products

**Used In**: Home Page (Hero / Featured Section)

### GET /api/products/bestsellers
**Description**: Get best-selling products.  
**Features**:
- Sorted by salesCount (highest first)
- Limited results (default: 6-8)
- Only active products

**Used In**: Home Page (Best Sellers Carousel)

### GET /api/products/:slug
**Description**: Get detailed information of a single product using slug.  
**Features**:
- Full product details
- All color variants with images
- All sizes with current stock quantity
- Description, multiple images, average rating, and reviews
- Shows if customization is allowed

**Used In**: Product Detail Page

### GET /api/products/:id/related
**Description**: Get related/similar products.  
**Features**:
- Products from same category
- Excludes current product
- Limited results (default: 4-6)

**Used In**: Product Detail Page (Related Products Section)

---

## 3. Authenticated User Endpoints

### POST /api/reviews
**Description**: Submit a review for a product.  
**Features**:
- Requires valid JWT token (user must be logged in)
- Accepts: productId, rating (1-5), comment (optional)
- Automatically updates product's averageRating and reviewCount
- Prevents duplicate reviews from same user on same product

**Used In**: Product Detail Page (Reviews Section)

---

## 4. Admin Only Endpoints (Requires Admin Role)

### POST /api/admin/products
**Description**: Create a new t-shirt product.  
**Features**:
- Create product with name, slug, basePrice, description, category, images
- Add multiple color variants
- For each variant: color name + variant image + sizes with stock quantity
- Image upload to Cloudinary supported
- Uses database transaction for data consistency

**Used In**: Admin Product Creation Form

### GET /api/admin/products
**Description**: Get all products for admin dashboard.  
**Features**:
- List all products (including draft and inactive)
- Filter by status (ACTIVE, DRAFT, INACTIVE)
- Pagination support
- Returns full details with variants and stock levels

**Used In**: Admin Products Management Page

### GET /api/admin/products/:id
**Description**: Get single product details for editing.  
**Features**:
- Returns complete product data including all variants and sizes
- Used for pre-filling edit form

**Used In**: Admin Edit Product Page

### PUT /api/admin/products/:id
**Description**: Update an existing product.  
**Features**:
- Update name, description, price, category, images
- Update or add new variants and stock quantities
- Maintains data consistency with transaction

**Used In**: Admin Edit Product Page

### PATCH /api/admin/products/:id/status
**Description**: Change product status.  
**Features**:
- Update status to ACTIVE, DRAFT, or INACTIVE
- INACTIVE = soft delete (hidden from customers)

**Used In**: Admin Product List (Quick Status Change)

### DELETE /api/admin/products/:id
**Description**: Permanently delete a product.  
**Features**:
- Deletes product and all related variants/sizes
- Safety check: prevents deletion if linked to any orders

**Used In**: Admin Product Management

### POST /api/admin/products/bulk-upload
**Description**: Upload multiple products at once.  
**Features**:
- Accepts JSON or CSV file
- Creates multiple products with variants in one request
- Useful for bulk inventory setup

**Used In**: Admin Bulk Upload Tool

### POST /api/admin/products/:id/variants
**Description**: Add a new color variant to an existing product.  
**Features**:
- Add new color with mockup image
- Set stock quantities for different sizes

**Used In**: Admin Product Edit Page

---

## 5. Data Flow Summary

**Customer Flow**:
1. Shop Page → `GET /api/products` (with filters) → Display grid
2. Click product → `GET /api/products/:slug` → Show detail + variants + reviews
3. Submit review → `POST /api/reviews`

**Admin Flow**:
1. Create product → `POST /api/admin/products` (with variants & stock)
2. View products → `GET /api/admin/products`
3. Edit product → `GET /api/admin/products/:id` then `PUT /api/admin/products/:id`
4. Change status → `PATCH /api/admin/products/:id/status`

**Stock Handling**:
- Stock is stored in Product Sizes table
- When order is placed, stock is reduced (handled in Order module)

---

**End of Document**

This Markdown file covers **all product-related endpoints** with clear features and usage.  
You can save this as `PRODUCT_ENDPOINTS.md` and share with your developer.