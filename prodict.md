# Product Management System – Custom Design Platform
**For T-shirts, Mugs, Kurtas, Pants, Sarees, Hoodies, etc.**

## 1. Core Concepts

- **Product** = Base template (e.g., "Premium Oversized T-Shirt")
- **ProductVariant** = Specific combination (Black / XL / Cotton)
- **DesignArea** = Printable zones with rules (Front, Back, Left Sleeve, Inside Mug, etc.)
- **ProductType** = Determines UI, validation and mockup logic

## 2. Full Product Lifecycle Flow

### 2.1 Admin Adds a New Product
1. Choose `productType` (Apparel / Drinkware / Accessory)
2. Fill basic info + base price
3. Add **Design Areas** (with max width/height, allowed file types, DPI requirement)
4. Create default **Variants** (sizes + colors)
5. Upload high-quality mockup images
6. Set tags, meta SEO, print technique
7. Publish (`isActive = true`)

### 2.2 Customer Journey (Frontend Flow)
1. Browse → Category / Collection / Search
2. Select product → See all variants + price
3. Click **"Customize"** button (only if `isCustomizable = true`)
4. Open **Design Studio**:
   - Choose design area
   - Upload own design OR use AI generator
   - Drag, resize, rotate design (with real-time preview)
   - See live mockup on the chosen product variant
5. Add to cart with saved design JSON + preview image
6. Checkout → Order created with design files attached

### 2.3 Backend / Order Processing
- Order contains `ProductVariant` + `designData` (JSON per DesignArea)
- Print file generation (PDF/PNG for each area)
- Send to print partner (or in-house printer)
- Update order status

## 3. Key Features You Can Build With This Entity

| Feature                        | How it works with current entity                     | Status |
|-------------------------------|-------------------------------------------------------|--------|
| Multi-product type support    | `productType` enum                                    | ✅ Done |
| Fabric vs Mug support         | `material` + nullable `gsm`                           | ✅ Done |
| Shipping cost                 | `weightGrams`                                         | ✅ Done |
| Different print areas         | `DesignArea` relation                                 | ✅ Done |
| Real-time mockup              | Use `ProductImage` + DesignArea rules                 | Ready |
| Variant pricing               | Handled in `ProductVariant` entity                    | Ready |
| SEO & Collections             | `metaTitle`, `metaDescription`, `tags`                | ✅ Done |
| Featured / Trending products  | `isFeatured`                                          | ✅ Done |
| Reviews & Ratings             | `Review` relation                                     | ✅ Done |

## 4. Future-Proof Extensions (Easy to Add Later)

- Dynamic attributes (JSON column) for very specific fields
- Bulk import from Printful / Gelato / CustomCat
- AI design suggestions
- Size chart per product type
- Discount rules per product

---

**Next Steps for you:**

1. Update your `Product` entity with the code above.
2. Create the related entities (`ProductVariant`, `DesignArea`) if not already done.
3. Run migration:  
   ```bash
   npm run typeorm migration:generate -n AddProductImprovements
   npm run typeorm migration:run