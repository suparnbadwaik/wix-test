/**
 * External Catalog Data Store
 * In a real application, this would be replaced with actual database calls or API requests
 */

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: string;
  fullPrice?: string;
  inventory: number;
  imageId?: string;
  variants?: Record<string, CatalogVariant>;
  type: 'PHYSICAL' | 'DIGITAL' | 'SERVICE' | 'GIFT_CARD';
  weight?: number;
  sku?: string;
}

export interface CatalogVariant {
  color?: string;
  size?: string;
  material?: string;
  sku: string;
  price: string;
  inventory: number;
}

/**
 * Sample catalog items
 * Replace this with your actual external catalog/database
 */
export const catalogItems: Record<string, CatalogItem> = {
  'item_001': {
    id: 'item_001',
    name: 'Premium Cotton T-Shirt',
    description: 'High-quality 100% cotton t-shirt with custom design',
    price: '29.99',
    fullPrice: '39.99',
    inventory: 100,
    type: 'PHYSICAL',
    weight: 0.3,
    imageId: '11062b_8d8c5e6a4a5d4f1e8b7c9d0e1f2a3b4c~mv2.jpg', // Replace with actual Wix Media ID
    variants: {
      'Red-S': {
        color: 'Red',
        size: 'S',
        sku: 'TSH-RED-S',
        price: '29.99',
        inventory: 25
      },
      'Red-M': {
        color: 'Red',
        size: 'M',
        sku: 'TSH-RED-M',
        price: '29.99',
        inventory: 30
      },
      'Red-L': {
        color: 'Red',
        size: 'L',
        sku: 'TSH-RED-L',
        price: '31.99',
        inventory: 20
      },
      'Blue-S': {
        color: 'Blue',
        size: 'S',
        sku: 'TSH-BLUE-S',
        price: '29.99',
        inventory: 25
      },
      'Blue-M': {
        color: 'Blue',
        size: 'M',
        sku: 'TSH-BLUE-M',
        price: '29.99',
        inventory: 35
      },
      'Blue-L': {
        color: 'Blue',
        size: 'L',
        sku: 'TSH-BLUE-L',
        price: '31.99',
        inventory: 15
      }
    }
  },
  'item_002': {
    id: 'item_002',
    name: 'Digital Course: Web Development Fundamentals',
    description: 'Complete online course with video lessons and exercises',
    price: '99.99',
    inventory: 999, // Digital products have unlimited inventory
    type: 'DIGITAL',
    sku: 'COURSE-WEB-001'
  },
  'item_003': {
    id: 'item_003',
    name: '1-Hour Consultation Service',
    description: 'Professional consultation service via video call',
    price: '150.00',
    inventory: 50,
    type: 'SERVICE',
    sku: 'CONSULT-1HR'
  },
  'item_004': {
    id: 'item_004',
    name: 'Gift Card - $50',
    description: 'Digital gift card - $50 value',
    price: '50.00',
    inventory: 999,
    type: 'GIFT_CARD',
    sku: 'GIFT-50'
  },
  'item_005': {
    id: 'item_005',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones',
    price: '199.99',
    fullPrice: '249.99',
    inventory: 45,
    type: 'PHYSICAL',
    weight: 0.8,
    sku: 'HDPHN-WRL-001'
  }
};

/**
 * Get a catalog item by ID
 * Replace with actual database query
 */
export function getCatalogItemById(itemId: string): CatalogItem | null {
  return catalogItems[itemId] || null;
}

/**
 * Get variant details by combining options
 */
export function getVariantByOptions(
  item: CatalogItem,
  options: Record<string, any>
): { variant: CatalogVariant | null; variantKey: string } {
  if (!item.variants || !options) {
    return { variant: null, variantKey: '' };
  }

  // Handle direct variant ID
  if (options.variantId) {
    const variant = item.variants[options.variantId];
    return { variant: variant || null, variantKey: options.variantId };
  }

  // Build variant key from options (e.g., "Red-M")
  const parts: string[] = [];
  if (options.color) parts.push(options.color);
  if (options.size) parts.push(options.size);
  if (options.material) parts.push(options.material);

  const variantKey = parts.join('-');
  const variant = item.variants[variantKey];

  return { variant: variant || null, variantKey };
}

/**
 * Check if item is in stock
 */
export function isItemInStock(itemId: string, quantity: number = 1): boolean {
  const item = getCatalogItemById(itemId);
  if (!item) return false;
  return item.inventory >= quantity;
}

/**
 * Update item inventory (for actual implementation)
 * This would update your external database
 */
export function updateInventory(itemId: string, quantityChange: number): boolean {
  const item = catalogItems[itemId];
  if (!item) return false;

  item.inventory += quantityChange;
  return true;
}
