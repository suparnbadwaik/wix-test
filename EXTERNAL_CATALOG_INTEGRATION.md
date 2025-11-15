# External Catalog Integration Guide

This guide explains how to integrate your external product catalog with the Wix catalog widget and add products to the Wix cart.

## Overview

The integration allows you to:
1. Fetch product data from your external API using external product IDs
2. Add these products to the Wix cart without storing them in Wix's product catalog
3. Pass custom fields (like gift card details) along with the product

## Architecture

```
External Catalog API → Widget → Backend → Wix Cart
```

## Files Created

### 1. `external-catalog.service.ts`
Handles communication with your external product catalog API.

**Key Functions:**
- `fetchExternalProduct(productId: string)` - Fetches a single product
- `searchExternalProducts(query: string)` - Searches for products

**Configuration:**
Update the API URL in the file:
```typescript
const EXTERNAL_CATALOG_API_URL = 'https://your-api.com/products';
```

### 2. `wix-cart.service.ts`
Handles adding products to the Wix cart.

**Key Functions:**
- `addProductViaBackend()` - Recommended approach using your backend
- `redirectToProductPage()` - Alternative approach if you map to Wix products

### 3. `backend/external-cart.web.ts`
Backend handler (placeholder for full backend implementation).

### 4. Updated `element.controller.ts`
Added cart integration logic to the widget controller.

## Implementation Steps

### Step 1: Configure Your External API

Edit `external-catalog.service.ts`:

```typescript
// Replace with your actual API URL
const EXTERNAL_CATALOG_API_URL = 'https://your-api.com/products';

// Add authentication if needed
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${YOUR_API_KEY}`,
},
```

### Step 2: Update Your External API Response Format

Make sure your API returns products in this format:

```json
{
  "id": "PRODUCT-123",
  "name": "Gift Card - $50",
  "price": 50.00,
  "description": "Digital gift card",
  "imageUrl": "https://your-cdn.com/images/gift-card.jpg"
}
```

### Step 3: Create Backend Endpoint (Recommended)

Create a backend endpoint `/api/add-to-cart` that:
1. Receives the external product ID from the frontend
2. Fetches product details from your external API
3. Validates and transforms the data
4. Adds the product to Wix cart using Wix backend SDK

Example in `wix-cart.service.ts`:
```typescript
await addProductViaBackend(externalProductId, quantity, customData);
```

### Step 4: Use in Your Widget

The widget controller already includes the integration:

```typescript
// In element.controller.ts
const handleSubmit = useCallback(() => {
  const externalProductId = 'PRODUCT-123'; // Get from props or user input
  handleSubmitWithExternalProduct(externalProductId);
}, [formValues]);
```

### Step 5: Pass External Product ID to Widget

You can pass the external product ID to the widget in several ways:

#### Option A: Via Widget Props
Edit `panel.tsx` to add a product ID field:
```typescript
<FormField label="External Product ID">
  <Input
    value={productId}
    onChange={(e) => handleProductIdChange(e.target.value)}
  />
</FormField>
```

#### Option B: Via URL Parameter
```typescript
const searchParams = new URLSearchParams(window.location.search);
const productId = searchParams.get('productId');
```

#### Option C: Hardcoded per Widget Instance
Store it in widget properties when the widget is configured.

## Testing

### 1. Test External API Connection

```typescript
import { fetchExternalProduct } from './external-catalog.service';

// Test fetching a product
const product = await fetchExternalProduct('PRODUCT-123');
console.log('Product:', product);
```

### 2. Test Cart Integration

Add console logs to see the flow:
```typescript
console.log('Fetching product:', productId);
console.log('Product data:', product);
console.log('Adding to cart with data:', customFields);
```

## Alternative Approaches

### Approach 1: Map to Wix Products
If you want products in Wix's catalog:
1. Create corresponding Wix products
2. Store mapping: External ID → Wix Product ID
3. Use standard Wix cart APIs with Wix product IDs

### Approach 2: Custom Line Items
Use Wix custom line items (available on certain plans):
- Allows adding products not in Wix catalog
- Each item can have custom fields
- Useful for gift cards, donations, etc.

### Approach 3: Hybrid Approach
- Store minimal product data in Wix (name, price, image)
- Store external product ID in product metadata
- Fetch additional details from external API when needed

## Troubleshooting

### Product Not Adding to Cart
1. Check browser console for errors
2. Verify external API is accessible (CORS headers)
3. Check Wix cart API permissions
4. Verify product data format matches Wix requirements

### CORS Issues
If calling external API from frontend:
```typescript
// Your external API needs these headers:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

Or use backend as proxy to avoid CORS.

### Authentication
If your external API requires authentication:
1. Store API credentials in backend environment variables
2. Make API calls from backend only
3. Never expose API keys in frontend code

## Next Steps

1. **Set up your external API endpoint** - Update the URL in `external-catalog.service.ts`
2. **Implement backend handler** - Create `/api/add-to-cart` endpoint
3. **Test with real product IDs** - Use actual IDs from your catalog
4. **Add product ID input** - Let users or admins specify which product to load
5. **Handle errors gracefully** - Show user-friendly error messages
6. **Add loading states** - Show spinners while fetching/adding to cart

## Example Flow

```
User clicks "Add to Cart"
  ↓
Widget calls handleSubmit()
  ↓
Fetch product from external API (externalProductId: "GIFT-50")
  ↓
Call backend /api/add-to-cart with product data + custom fields
  ↓
Backend validates and adds to Wix cart
  ↓
Success - show confirmation to user
```

## Questions?

Common scenarios:

**Q: Do I need to store products in Wix?**
A: No! You can add products directly to cart from your external API.

**Q: Can I pass custom fields (like recipient email)?**
A: Yes! Use the `customFields` parameter when adding to cart.

**Q: What if my API is slow?**
A: Show loading states in the UI and consider caching product data.

**Q: Can I use this for non-gift-card products?**
A: Yes! This works for any product type from your external catalog.
