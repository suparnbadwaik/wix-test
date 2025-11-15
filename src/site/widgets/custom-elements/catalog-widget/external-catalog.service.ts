/**
 * External Catalog Service
 * Handles communication with your external product catalog API
 */

export interface ExternalProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  // Add more fields as needed from your external catalog
}

// Configure your external API endpoint
// TODO: Replace with your actual external catalog API URL
const EXTERNAL_CATALOG_API_URL = 'https://your-api.com/products';

/**
 * Fetch product details from external catalog API
 */
export async function fetchExternalProduct(productId: string): Promise<ExternalProduct> {
  // TODO: Replace with actual API call
  // For now, returning mock data
  console.log('Mock: Fetching external product', productId);

  /* COMMENTED OUT - Uncomment when ready to use real API
  try {
    const response = await fetch(`${EXTERNAL_CATALOG_API_URL}/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${YOUR_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product: ExternalProduct = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching external product:', error);
    throw error;
  }
  */

  // Return hardcoded mock product for testing
  return {
    id: productId,
    name: `Gift Card - $50`,
    price: 50.00,
    description: 'Digital gift card for any occasion',
    imageUrl: 'https://static.wixstatic.com/media/c22c23_c05a35de16d344e1a3e5c3e6a7e3e8e0~mv2.jpg',
  };
}

/**
 * Search products in external catalog
 */
export async function searchExternalProducts(query: string): Promise<ExternalProduct[]> {
  // TODO: Replace with actual API call
  // For now, returning mock data
  console.log('Mock: Searching external products', query);

  /* COMMENTED OUT - Uncomment when ready to use real API
  try {
    const response = await fetch(`${EXTERNAL_CATALOG_API_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    const products: ExternalProduct[] = await response.json();
    return products;
  } catch (error) {
    console.error('Error searching external products:', error);
    throw error;
  }
  */

  // Return hardcoded mock products for testing
  return [
    {
      id: 'PRODUCT-001',
      name: 'Gift Card - $25',
      price: 25.00,
      description: 'Digital gift card - $25 value',
      imageUrl: 'https://static.wixstatic.com/media/c22c23_c05a35de16d344e1a3e5c3e6a7e3e8e0~mv2.jpg',
    },
    {
      id: 'PRODUCT-002',
      name: 'Gift Card - $50',
      price: 50.00,
      description: 'Digital gift card - $50 value',
      imageUrl: 'https://static.wixstatic.com/media/c22c23_c05a35de16d344e1a3e5c3e6a7e3e8e0~mv2.jpg',
    },
    {
      id: 'PRODUCT-003',
      name: 'Gift Card - $100',
      price: 100.00,
      description: 'Digital gift card - $100 value',
      imageUrl: 'https://static.wixstatic.com/media/c22c23_c05a35de16d344e1a3e5c3e6a7e3e8e0~mv2.jpg',
    },
  ];
}
