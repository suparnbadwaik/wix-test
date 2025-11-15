/**
 * Type declarations for Wix backend modules
 */

declare module 'backend/external-cart.web.js' {
  export interface AddToCartRequest {
    externalProductId: string;
    quantity: number;
    customData?: Record<string, any>;
  }

  export interface CartResult {
    success: boolean;
    message: string;
    cartItemId?: string;
    error?: string;
  }

  export function addToCart(request: AddToCartRequest): Promise<CartResult>;
}
