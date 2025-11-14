/**
 * Wix Catalog Service Plugin Implementation
 * 
 * This plugin integrates your external catalog with Wix eCommerce platform.
 * Wix calls this service whenever:
 * - An item is added to cart
 * - Cart is updated
 * - Checkout is updated
 * - Order is created
 */

import { catalog } from '@wix/ecom/service-plugins';
import { 
  getCatalogItemById, 
  getVariantByOptions,
  type CatalogItem 
} from './catalog-data';

/**
 * Build description lines for item variants
 */
function buildDescriptionLines(options: Record<string, any>): any[] {
  const descriptionLines: any[] = [];

  if (options.color) {
    descriptionLines.push({
      name: { 
        original: 'Color',
        translated: 'Color'
      },
      plainText: { 
        original: options.color,
        translated: options.color
      }
    });
  }

  if (options.size) {
    descriptionLines.push({
      name: { 
        original: 'Size',
        translated: 'Size'
      },
      plainText: { 
        original: options.size,
        translated: options.size
      }
    });
  }

  if (options.material) {
    descriptionLines.push({
      name: { 
        original: 'Material',
        translated: 'Material'
      },
      plainText: { 
        original: options.material,
        translated: options.material
      }
    });
  }

  return descriptionLines;
}

/**
 * Build item data for Wix eCommerce
 */
function buildItemData(
  item: CatalogItem,
  options: Record<string, any> | undefined,
  currency: string
): any {
  // Get variant details if applicable
  const { variant, variantKey } = options 
    ? getVariantByOptions(item, options)
    : { variant: null, variantKey: '' };

  // Use variant data if available, otherwise use base item data
  const price = variant ? variant.price : item.price;
  const sku = variant ? variant.sku : (item.sku || item.id);
  const inventory = variant ? variant.inventory : item.inventory;

  // Build description lines for variants
  const descriptionLines = options ? buildDescriptionLines(options) : [];

  // Build the item data object
  const itemData: any = {
    // Required fields
    productName: {
      original: item.name,
      translated: item.name
    },
    itemType: {
      preset: item.type
    },
    price: price,
    
    // Optional but recommended fields
    fullPrice: item.fullPrice || price,
    
    // Description lines (for variants)
    descriptionLines: descriptionLines,
    
    // URL to product page
    url: {
      relativePath: `/product/${item.id}`,
      url: `https://yoursite.com/product/${item.id}` // Replace with your actual site URL
    },
    
    // Inventory
    quantityAvailable: inventory
  };

  // Add physical properties for physical items
  if (item.type === 'PHYSICAL') {
    itemData.physicalProperties = {
      sku: sku,
      shippable: true,
      weight: item.weight || 0.5
    };
  }

  // Add media if available
  if (item.imageId) {
    itemData.media = {
      id: item.imageId,
      height: 800,
      width: 800,
      altText: item.name,
      filename: `${item.id}.jpg`
    };
  }

  return itemData;
}

/**
 * Main handler for Get Catalog Items
 * This is called by Wix whenever cart/checkout/order needs item details
 */
catalog.provideHandlers({
  getCatalogItems: async (payload) => {
    try {
      const { request, metadata } = payload;
      const { catalogReferences, currency, weightUnit } = request;

      console.log('📦 Catalog Service Plugin - Get Catalog Items Called');
      console.log('📋 Requested Items:', catalogReferences?.length || 0);
      console.log('💰 Currency:', currency);
      console.log('⚖️  Weight Unit:', weightUnit);

      const catalogItems: any[] = [];

      // Process each requested item
      if (catalogReferences) {
        for (const ref of catalogReferences) {
          const { catalogReference, quantity } = ref;
          
          if (!catalogReference || !catalogReference.catalogItemId) continue;
          
          const { catalogItemId, appId, options } = catalogReference;

          console.log(`\n🔍 Processing Item: ${catalogItemId}`);
          console.log(`   App ID: ${appId}`);
          console.log(`   Quantity: ${quantity}`);
          console.log(`   Options:`, options);

          // Look up item in your external catalog
          const item = getCatalogItemById(catalogItemId);

          if (!item) {
            console.log(`   ❌ Item not found in catalog`);
            // Skip items that don't exist - don't include in response
            continue;
          }

          console.log(`   ✅ Item found: ${item.name}`);
          console.log(`   💵 Price: ${item.price}`);
          console.log(`   📦 Inventory: ${item.inventory}`);

          // Check inventory
          if (quantity && item.inventory < quantity) {
            console.log(`   ⚠️  Warning: Insufficient inventory (requested: ${quantity}, available: ${item.inventory})`);
            // Still return the item, but with current available quantity
          }

          // Build the item data
          const itemData = buildItemData(item, options || undefined, currency || 'USD');

          // Add to response - catalogReference must be identical to request
          catalogItems.push({
            catalogReference: catalogReference,
            data: itemData
          });

          console.log(`   ✅ Item added to response`);
        }
      }

      console.log(`\n📤 Returning ${catalogItems.length} items to Wix`);

      // Return the response
      const response: any = {
        catalogItems: catalogItems
      };

      return response;

    } catch (error) {
      console.error('❌ Error in getCatalogItems:', error);
      
      // Return empty array on error - Wix will handle gracefully
      return {
        catalogItems: []
      };
    }
  }
});

console.log('✅ Catalog Service Plugin initialized successfully');
