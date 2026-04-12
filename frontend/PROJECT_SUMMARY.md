# Persomith - Next.js E-Commerce Platform

A complete print-on-demand e-commerce website built with Next.js 15, React, Tailwind CSS, and TypeScript.

## Project Overview

Persomith is a fully functional e-commerce platform for print-on-demand products including t-shirts, mugs, hoodies, hats, posters, and tote bags. The site features a modern, professional design with responsive layouts optimized for all devices. Built with a sophisticated blue and green color theme for a contemporary aesthetic.

## Key Features

### ✅ Complete Pages
- **Home Page**: Hero section, featured products, categories showcase, how-it-works section, and CTA
- **Shop/Catalog Page**: Filtering by category, price range, sorting options with responsive design
- **Product Detail Page**: Full product information, variants (color/size), ratings, reviews, quantity selector, related products
- **Shopping Cart**: View cart items, modify quantities, remove items, order summary with tax and shipping
- **Checkout Page**: Complete checkout flow with shipping and payment forms, order confirmation
- **Blog Listing**: Featured article, grid of blog posts, newsletter signup
- **Blog Detail Pages**: Full article content, related posts, author info, share buttons

### ✅ Core Components
- **Header**: Sticky navigation with logo, menu links, search, cart icon with item count, mobile menu
- **Footer**: Multi-column footer with links, contact info, newsletter signup
- **ProductCard**: Product display with image, price, discount, rating, reviews, add-to-cart button
- **FilterSidebar**: Category filtering, price range slider, sorting options, clear filters button

### ✅ Functionality
- **Cart Management**: Full shopping cart with localStorage persistence
- **Filtering & Sorting**: Filter by category and price, sort by popular/newest/price/rating
- **Product Variants**: Color and size selection for products
- **Responsive Design**: Mobile-first design that works perfectly on all screen sizes
- **State Management**: React Context for cart state management

## Project Structure

```
app/
├── page.tsx              # Home page
├── shop/
│   └── page.tsx          # Shop/catalog page
├── products/
│   └── [id]/
│       └── page.tsx      # Product detail page
├── cart/
│   └── page.tsx          # Shopping cart page
├── checkout/
│   └── page.tsx          # Checkout page
├── blog/
│   ├── page.tsx          # Blog listing page
│   └── [id]/
│       └── page.tsx      # Blog post detail page
├── layout.tsx            # Root layout with CartProvider
└── globals.css           # Global styles with design tokens

components/
├── header.tsx            # Header component
├── footer.tsx            # Footer component
├── product-card.tsx      # Product card component
├── filter-sidebar.tsx    # Filter sidebar component
└── ui/                   # shadcn/ui components

lib/
├── mockData.ts           # Mock products, categories, blog posts
├── cartContext.tsx       # Cart state management
└── utils.ts              # Utility functions

public/images/
├── product-*.jpg         # 10 AI-generated product images
├── category-*.jpg        # 6 AI-generated category images
├── blog-*.jpg            # 4 AI-generated blog images
└── hero-banner.jpg       # Hero banner image
```

## Design System

### Color Palette
- **Primary**: Deep Blue (`oklch(0.45 0.18 250)`) - Main brand color
- **Secondary**: Fresh Green (`oklch(0.52 0.16 145)`) - Complementary accent
- **Accent**: Vibrant Green (`oklch(0.65 0.2 145)`) - Call-to-action color
- **Neutrals**: Light grays, whites, and dark blues for backgrounds and text

### Typography
- **Fonts**: Geist (sans-serif) for all text
- **Font Stack**: System fonts with fallbacks for optimal performance

### Spacing & Layout
- Uses Tailwind CSS spacing scale (p-4, gap-6, etc.)
- Flexbox for most layouts, CSS Grid for complex 2D layouts
- Max-width container: 7xl (80rem)

## Mock Data

### Products (10 items)
- Classic Black T-Shirt
- Premium Coffee Mug
- Baseball Cap
- Art Print Poster
- Zip-Up Hoodie
- Cotton Tote Bag
- Long Sleeve T-Shirt
- Stainless Steel Tumbler
- Snapback Hat
- Canvas Wall Art

### Categories (6)
- T-Shirts (45 products)
- Mugs (32 products)
- Hats & Caps (28 products)
- Posters (38 products)
- Hoodies (24 products)
- Bags (20 products)

### Blog Posts (4)
- How to Design the Perfect Print-On-Demand Product
- The Future of E-Commerce: Print-On-Demand Trends
- Sustainable Printing: Making a Difference
- Starting Your Print-On-Demand Business: A Beginner's Guide

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Image Handling**: Next.js Image optimization
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Features to Note

### Shopping Cart
- Items are persisted in localStorage
- Real-time cart count in header
- Cart items can be modified or removed

### Product Filtering
- Filter by multiple categories simultaneously
- Dynamic price range slider (0-100 USD)
- Multiple sort options (popular, newest, price, rating)
- Clear filters button

### Responsive Design
- Mobile menu with hamburger icon
- Responsive grid layouts (1-2-3 columns)
- Touch-friendly buttons and interactions
- Optimized images for all screen sizes

### User Experience
- Smooth hover effects and transitions
- Loading states and confirmations
- Empty cart messaging
- Order confirmation on checkout
- Related products recommendations
- Star ratings for products and reviews

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Responsive design from 320px and up

## Performance
- Optimized images with Next.js Image component
- Code splitting and lazy loading
- CSS modules and Tailwind CSS for minimal CSS
- Static generation where possible

## Future Enhancements
- User authentication and accounts
- Real database integration
- Payment processing (Stripe/PayPal)
- Email notifications
- Product reviews and ratings
- Search functionality
- Admin dashboard
- Wishlist feature

## Notes
- All product data is mocked (no database)
- Cart persists in localStorage
- Checkout form is a mockup (no actual payment processing)
- Images are AI-generated for demo purposes

---

Built with v0 - Vercel's AI-powered code generation platform.
