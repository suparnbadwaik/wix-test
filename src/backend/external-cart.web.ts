/**
 * Backend Web Module for External Catalog Integration
 * Uses Wix REST API to add products to cart
 * 
 * Exposed as HTTP endpoint at: /_functions/external-cart/addToCart
 */

interface ExternalProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface AddToCartRequest {
  externalProductId: string;
  quantity: number;
  customData?: Record<string, any>;
}

interface CartResult {
  success: boolean;
  message: string;
  cartItemId?: string;
  error?: string;
}

/**
 * Fetch product from external catalog API
 */
async function fetchExternalProduct(productId: string): Promise<ExternalProduct> {
  // TODO: Replace with your actual external API endpoint
  const EXTERNAL_API_URL = 'https://your-api.com/products';
  
  /* COMMENTED OUT - Uncomment when ready to use real API
  const response = await fetch(`${EXTERNAL_API_URL}/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication if needed
      // 'Authorization': `Bearer ${YOUR_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
  */

  // Return mock product for now
  return {
    id: productId,
    name: `Gift Card - $50`,
    price: 50.00,
    description: 'Digital gift card for any occasion',
    imageUrl: 'https://static.wixstatic.com/media/c22c23_c05a35de16d344e1a3e5c3e6a7e3e8e0~mv2.jpg',
  };
}

/**
 * Add product to Wix cart using REST API
 * This is a backend HTTP endpoint that can be called from the frontend
 * Exposed at: POST /_functions/external-cart/addToCart
 */
export async function post_addToCart(request: any) {
  try {
    const body: AddToCartRequest = await request.body.json();
    const { externalProductId, quantity, customData } = body;

    console.log('Backend: Adding product to cart', { externalProductId, quantity });

    // Step 1: Fetch product details from external API
    const product = await fetchExternalProduct(externalProductId);
    console.log('Backend: Product fetched', product);

    // Step 2: Prepare custom text fields
    const customTextFields = [
      {
        title: 'External Product ID',
        value: product.id,
      },
    ];

    // Add custom data as fields
    if (customData) {
      Object.entries(customData).forEach(([key, value]) => {
        customTextFields.push({
          title: key,
          value: String(value),
        });
      });
    }

    // Step 3: Prepare request body for Wix REST API
    const requestBody = {
      lineItems: [
        {
          productName: {
            original: product.name,
          },
          quantity: quantity,
          price: product.price,
          ...(product.description && {
            description: {
              original: product.description,
            },
          }),
          ...(product.imageUrl && {
            image: product.imageUrl,
          }),
          customTextFields: customTextFields,
        },
      ],
    };

    console.log('Backend: Calling Wix REST API', requestBody);

    // Step 4: Call Wix REST API
    // Note: The exact endpoint URL may vary based on your Wix setup
    const wixApiUrl = 'https://www.wixapis.com/stores/v1/carts/current/addToCart';
    
    const response = await fetch(wixApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Wix will handle authentication automatically in backend context
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Wix API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Backend: Product added successfully', result);

    const cartResult: CartResult = {
      success: true,
      message: 'Product added to cart successfully',
      cartItemId: result.cart?._id || result.cartId,
    };

    return {
      status: 200,
      body: cartResult,
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error: any) {
    console.error('Backend: Error adding product to cart', error);
    
    const errorResult: CartResult = {
      success: false,
      message: 'Failed to add product to cart',
      error: error.message,
    };

    return {
      status: 500,
      body: errorResult,
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
