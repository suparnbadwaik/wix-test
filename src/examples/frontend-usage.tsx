/**
 * Frontend Examples: How to Use Your Catalog Service Plugin
 * 
 * These examples show how to interact with your external catalog
 * from the frontend of your Wix site or app.
 * 
 * NOTE: This file contains example code for reference only.
 * The @wix/ecom/frontend package is available in Wix sites,
 * not in the CLI app development environment.
 * 
 * Copy these examples to your frontend code when building
 * your Wix site or Blocks components.
 */

// @ts-nocheck - Example code for reference
/* eslint-disable */

// Example 1: Add a Simple Item to Cart
// -------------------------------------
import { cart } from '@wix/ecom/frontend';

export async function addSimpleItemToCart() {
  try {
    const result = await cart.addToCurrentCart({
      lineItems: [{
        quantity: 1,
        catalogReference: {
          appId: "YOUR_APP_ID", // Replace with your actual app ID
          catalogItemId: "item_005", // Wireless Headphones
        }
      }]
    });
    
    console.log('✅ Item added to cart:', result);
    return result;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    throw error;
  }
}

// Example 2: Add Item with Variants (Color & Size)
// ------------------------------------------------
export async function addVariantItemToCart() {
  try {
    const result = await cart.addToCurrentCart({
      lineItems: [{
        quantity: 2,
        catalogReference: {
          appId: "YOUR_APP_ID",
          catalogItemId: "item_001", // Premium Cotton T-Shirt
          options: {
            color: "Blue",
            size: "L"
          }
        }
      }]
    });
    
    console.log('✅ Variant item added to cart:', result);
    return result;
  } catch (error) {
    console.error('❌ Error adding variant:', error);
    throw error;
  }
}

// Example 3: Add Multiple Items at Once
// -------------------------------------
export async function addMultipleItemsToCart() {
  try {
    const result = await cart.addToCurrentCart({
      lineItems: [
        {
          quantity: 1,
          catalogReference: {
            appId: "YOUR_APP_ID",
            catalogItemId: "item_002", // Digital Course
          }
        },
        {
          quantity: 1,
          catalogReference: {
            appId: "YOUR_APP_ID",
            catalogItemId: "item_001",
            options: {
              color: "Red",
              size: "M"
            }
          }
        },
        {
          quantity: 3,
          catalogReference: {
            appId: "YOUR_APP_ID",
            catalogItemId: "item_004", // Gift Card
          }
        }
      ]
    });
    
    console.log('✅ Multiple items added:', result);
    return result;
  } catch (error) {
    console.error('❌ Error adding multiple items:', error);
    throw error;
  }
}

// Example 4: Get Current Cart
// ----------------------------
export async function getCurrentCart() {
  try {
    const currentCart = await cart.getCurrentCart();
    
    console.log('🛒 Current cart:', currentCart);
    console.log('📦 Total items:', currentCart.lineItems?.length || 0);
    console.log('💰 Subtotal:', currentCart.subtotal?.formattedAmount);
    
    return currentCart;
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    throw error;
  }
}

// Example 5: Update Item Quantity in Cart
// ---------------------------------------
export async function updateCartItemQuantity(lineItemId: string, newQuantity: number) {
  try {
    const result = await cart.updateCurrentCartLineItemQuantity({
      lineItemId: lineItemId,
      quantity: newQuantity
    });
    
    console.log('✅ Quantity updated:', result);
    return result;
  } catch (error) {
    console.error('❌ Error updating quantity:', error);
    throw error;
  }
}

// Example 6: Remove Item from Cart
// --------------------------------
export async function removeItemFromCart(lineItemId: string) {
  try {
    const result = await cart.removeLineItemsFromCurrentCart({
      lineItemIds: [lineItemId]
    });
    
    console.log('✅ Item removed from cart');
    return result;
  } catch (error) {
    console.error('❌ Error removing item:', error);
    throw error;
  }
}

// Example 7: Create Checkout Directly (Buy Now)
// --------------------------------------------
import { checkout } from '@wix/ecom/frontend';

export async function buyNowDirectly() {
  try {
    const result = await checkout.createCheckout({
      lineItems: [{
        quantity: 1,
        catalogReference: {
          appId: "YOUR_APP_ID",
          catalogItemId: "item_003", // Consultation Service
        }
      }]
    });
    
    console.log('✅ Checkout created:', result);
    
    // Navigate to checkout page
    if (result.checkoutId) {
      window.location.href = `/checkout/${result.checkoutId}`;
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error creating checkout:', error);
    throw error;
  }
}

// Example 8: React Component - Add to Cart Button
// -----------------------------------------------
import React, { useState } from 'react';

interface AddToCartButtonProps {
  appId: string;
  itemId: string;
  options?: Record<string, any>;
  quantity?: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  appId,
  itemId,
  options,
  quantity = 1
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await cart.addToCurrentCart({
        lineItems: [{
          quantity,
          catalogReference: {
            appId,
            catalogItemId: itemId,
            ...(options && { options })
          }
        }]
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      style={{
        padding: '12px 24px',
        backgroundColor: success ? '#4CAF50' : '#3899EC',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      {loading ? 'Adding...' : success ? '✓ Added!' : 'Add to Cart'}
    </button>
  );
};

// Example 9: Product Selection with Variants
// ------------------------------------------
export const ProductSelector: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('Red');
  const [selectedSize, setSelectedSize] = useState('M');
  const appId = "YOUR_APP_ID";

  const colors = ['Red', 'Blue'];
  const sizes = ['S', 'M', 'L'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Premium Cotton T-Shirt</h2>
      <p>$29.99</p>
      
      <div style={{ marginBottom: '16px' }}>
        <label>Color: </label>
        <select 
          value={selectedColor} 
          onChange={(e) => setSelectedColor(e.target.value)}
          style={{ marginLeft: '8px', padding: '8px' }}
        >
          {colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label>Size: </label>
        <select 
          value={selectedSize} 
          onChange={(e) => setSelectedSize(e.target.value)}
          style={{ marginLeft: '8px', padding: '8px' }}
        >
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      
      <AddToCartButton
        appId={appId}
        itemId="item_001"
        options={{ color: selectedColor, size: selectedSize }}
      />
    </div>
  );
};

// Example 10: Using with Wix Blocks (Page Element)
// -----------------------------------------------
/**
 * In your Wix Blocks page element:
 * 
 * 1. Import this module
 * 2. Call the functions in your event handlers
 * 3. Use the components in your page structure
 */

export const WixBlocksExample = {
  // Use in button click handler
  onAddToCartClick: async (productId: string, options?: any) => {
    return await addSimpleItemToCart();
  },
  
  // Use in page load
  onPageLoad: async () => {
    const currentCart = await getCurrentCart();
    // Update UI with cart info
    return currentCart;
  }
};

/**
 * IMPORTANT: Remember to replace "YOUR_APP_ID" with your actual App ID!
 * 
 * Get your App ID from:
 * https://dev.wix.com/dc3/my-apps/
 * 
 * Your App ID looks like: "488433a3-ec42-430d-ad79-94b4df8fc604"
 */
