/**
 * Wix Cart Service
 * Handles adding products to Wix eCommerce cart
 */

import type { ExternalProduct } from './external-catalog.service';

export interface AddToCartOptions {
  productId: string;
  quantity: number;
  customFields?: Record<string, string>;
}

export interface CartResult {
  success: boolean;
  message: string;
  cartItemId?: string;
  error?: string;
}

/**
 * Add an external product to Wix cart using Wix REST API
 * API Endpoint: POST /stores/v1/carts/current/addToCart
 */
export async function addExternalProductToCart(
  product: ExternalProduct,
  quantity: number = 1,
  customFields?: Record<string, string>
): Promise<CartResult> {
  console.log('Adding product to Wix cart via REST API', { product, quantity, customFields });

  try {
    // Prepare custom text fields
    const customTextFields = [];
    
    // Add external product ID
    customTextFields.push({
      title: 'External Product ID',
      value: product.id,
    });

    // Add any additional custom fields
    if (customFields) {
      Object.entries(customFields).forEach(([key, value]) => {
        customTextFields.push({
          title: key,
          value: value,
        });
      });
    }

    // Prepare the request body for Wix REST API
    const requestBody = {
      lineItems: [
        {
          productName: {
            original: product.name,
          },
          quantity: quantity,
          price: product.price,
          description: product.description ? {
            original: product.description,
          } : undefined,
          image: product.imageUrl,
          customTextFields: customTextFields,
        },
      ],
    };

    // Call Wix REST API to add to cart
    // Note: This needs to be called through your backend because you need authorization
    const response = await fetch('/_api/wix-ecommerce/v1/cart/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Product added to Wix cart successfully:', result);

    return {
      success: true,
      message: 'Product added to cart',
      cartItemId: result.cart?._id || result.cartId || product.id,
    };
  } catch (error: any) {
    console.error('Error adding product to Wix cart:', error);
    return {
      success: false,
      message: 'Failed to add product to cart',
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Add product to cart - simplified approach
 * Fetches the external product and uses the direct cart API
 */
export async function addProductViaBackend(
  externalProductId: string,
  quantity: number = 1,
  customData?: Record<string, any>
): Promise<CartResult> {
  console.log('Adding product to cart', { externalProductId, quantity, customData });

  try {
    // Import the external catalog service to fetch product details
    const { fetchExternalProduct } = await import('./external-catalog.service');
    
    // Fetch the product from external catalog
    const product = await fetchExternalProduct(externalProductId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Prepare custom fields with all the custom data
    const customFields: Record<string, string> = {};
    if (customData) {
      Object.entries(customData).forEach(([key, value]) => {
        customFields[key] = String(value);
      });
    }

    // Use the direct cart API function
    return await addExternalProductToCart(product, quantity, customFields);
  } catch (error: any) {
    console.error('Error adding product to cart:', error);
    return {
      success: false,
      message: 'Failed to add product to cart',
      error: error.message,
    };
  }
}

/**
 * Redirect to a Wix product page
 * Useful if you maintain a mapping between external products and Wix products
 */
export function redirectToProductPage(wixProductId: string): void {
  window.location.href = `/product-page/${wixProductId}`;
}
