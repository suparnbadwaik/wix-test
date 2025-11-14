# Catalog Service Plugin Setup Guide

This project includes a complete **Wix Catalog Service Plugin** implementation that integrates your external catalog with the Wix eCommerce platform.

## 📁 Project Structure

```
src/
├── backend/
│   ├── catalog-data.ts              # External catalog data store
│   └── catalog-service-plugin.ts    # Main service plugin implementation
└── dashboard/
    └── pages/
        ├── catalog-manager.tsx      # Catalog management UI
        └── page.tsx                 # Original dashboard page
```

## 🚀 What's Implemented

### 1. **External Catalog Data Store** (`catalog-data.ts`)
- Sample catalog with 5 different item types
- Support for product variants (colors, sizes, etc.)
- Inventory management functions
- Helper functions for variant handling

### 2. **Catalog Service Plugin** (`catalog-service-plugin.ts`)
- Full implementation of `getCatalogItems` handler
- Automatic variant handling
- Inventory checking
- Detailed logging for debugging
- Proper error handling

### 3. **Catalog Manager Dashboard** (`catalog-manager.tsx`)
- Visual catalog management interface
- Real-time stats display
- Item listing with all details
- Export functionality
- Integration examples and documentation

## 📋 Setup Instructions

### Step 1: Configure the Service Plugin in Wix

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Go to your Wix App Dashboard:**
   - Visit: https://dev.wix.com/dc3/my-apps/
   - Select your app: `ssb-catalog-app`

3. **Add the Catalog Service Plugin Extension:**
   - Go to **Extensions** in your app's dashboard
   - Click **Create Extension**
   - Scroll down to **Ecom Catalog**
   - Click **Create**

4. **Configure the deployment URI:**
   - The plugin will be automatically detected by Wix CLI
   - Your service plugin handlers are in `src/backend/catalog-service-plugin.ts`

### Step 2: Get Your App ID

1. Go to your app page in the dashboard
2. Copy your **App ID** (GUID format)
3. You'll need this when adding items to cart

### Step 3: Install eCommerce App

For the catalog plugin to work, you need the Wix eCommerce app installed:

1. Go to your test site
2. Add the **Wix eCommerce** app (or it may auto-install with your app)

### Step 4: Test the Integration

You can test the integration by adding items to cart programmatically:

```typescript
import { cart } from '@wix/ecom/frontend';

// Add item to cart (Wix will call your getCatalogItems handler)
await cart.addToCurrentCart({
  lineItems: [{
    quantity: 1,
    catalogReference: {
      appId: "YOUR_APP_ID", // From step 2
      catalogItemId: "item_001", // From catalog-data.ts
      options: {
        color: "Red",
        size: "M"
      }
    }
  }]
});
```

## 📦 Available Catalog Items

Your catalog includes these sample items:

| ID | Name | Type | Price | Variants |
|----|------|------|-------|----------|
| `item_001` | Premium Cotton T-Shirt | PHYSICAL | $29.99 | Red/Blue in S/M/L |
| `item_002` | Digital Course | DIGITAL | $99.99 | - |
| `item_003` | 1-Hour Consultation | SERVICE | $150.00 | - |
| `item_004` | Gift Card - $50 | GIFT_CARD | $50.00 | - |
| `item_005` | Wireless Headphones | PHYSICAL | $199.99 | - |

## 🔧 Customizing Your Catalog

### Replace Sample Data with Real Data

Edit `src/backend/catalog-data.ts`:

```typescript
// Replace the catalogItems object with your database calls
export async function getCatalogItemById(itemId: string): Promise<CatalogItem | null> {
  // Example: Replace with database query
  const item = await database.items.findOne({ id: itemId });
  return item;
}
```

### Connect to External Database/API

```typescript
// Example: PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function getCatalogItemById(itemId: string): Promise<CatalogItem | null> {
  const result = await pool.query(
    'SELECT * FROM catalog_items WHERE id = $1',
    [itemId]
  );
  return result.rows[0] || null;
}
```

### Add Media Images

To use real product images:

1. Upload images to **Wix Media Manager**
2. Get the media ID from the URL: `https://static.wixstatic.com/media/[MEDIA_ID].jpg`
3. Use the media ID in your catalog items:

```typescript
{
  imageId: "5cc69183e7954e2c9760fa2383870992.jpg",
  // ...
}
```

## 🎯 How It Works

### Flow Diagram

```
Customer adds item to cart
         ↓
Wix eCommerce Platform
         ↓
Calls your getCatalogItems handler
         ↓
Your catalog-service-plugin.ts
         ↓
Queries catalog-data.ts (or your database)
         ↓
Returns item details
         ↓
Wix displays in cart/checkout
```

### When is getCatalogItems Called?

Wix automatically calls your handler when:
- Item is added to cart
- Cart is updated
- Checkout is created/updated
- Order is created

This ensures Wix always has the latest price, availability, and item details.

## 🔍 Debugging

### View Plugin Logs

When running locally:
```bash
npm run dev
```

Logs will show in your terminal when items are requested:
```
📦 Catalog Service Plugin - Get Catalog Items Called
📋 Requested Items: 1
🔍 Processing Item: item_001
   ✅ Item found: Premium Cotton T-Shirt
   💵 Price: 29.99
```

### Test with Wix CLI

```bash
# Build your project
npm run build

# Test the service plugin
npm run dev
```

## 📚 Additional Resources

- [Wix Catalog Service Plugin Documentation](https://dev.wix.com/docs/rest/business-solutions/e-commerce/catalogs/catalog-service-plugin/introduction)
- [Build an eCommerce Business Solution](https://dev.wix.com/docs/rest/business-solutions/e-commerce/get-started/apps/build-a-business-solution)
- [Wix eCommerce Platform Overview](https://dev.wix.com/docs/rest/business-solutions/e-commerce/introduction)

## ⚠️ Important Notes

1. **catalogReference must be identical** in request and response
2. **Missing items should be excluded** from the response array
3. **Empty array** if no items exist (not an error)
4. **Item removed from cart** if not returned in subsequent calls
5. **Always return current data** (prices, inventory, etc.)

## 🚀 Next Steps

1. ✅ Set up the plugin extension in Wix dashboard
2. ✅ Replace sample data with your real catalog
3. ✅ Test adding items to cart
4. ✅ Build item pages for your products
5. ✅ Add additional eCommerce integrations (shipping, tax, etc.)
6. ✅ Submit your app to Wix App Market

## 💡 Need Help?

- Check the [Wix Developer Forum](https://www.wix.com/velo/forum)
- Review the example code in `catalog-service-plugin.ts`
- Use the Catalog Manager dashboard to visualize your items
- Contact Wix Developer Support

---

Happy coding! 🎉
