/**
 * EXAMPLE: How to add external product ID support to your widget
 * 
 * This shows different ways to specify which external product to load
 */

// OPTION 1: Add product ID as a widget property
// Update panel.tsx to include a product ID field:

/*
import React, { type FC, useState, useEffect, useCallback } from 'react';
import { widget } from '@wix/editor';
import { Input, FormField } from '@wix/design-system';

const Panel: FC = () => {
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    widget.getProp('external-product-id')
      .then(id => setProductId(id || ''))
      .catch(error => console.error('Failed to fetch product-id:', error));
  }, []);

  const handleProductIdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newProductId = event.target.value;
    setProductId(newProductId);
    widget.setProp('external-product-id', newProductId);
  }, []);

  return (
    <FormField label="External Product ID">
      <Input
        type="text"
        value={productId}
        onChange={handleProductIdChange}
        placeholder="e.g., PRODUCT-123"
        aria-label="External Product ID"
      />
    </FormField>
  );
};
*/

// OPTION 2: Accept product ID via URL parameter
// Use in element.tsx:

/*
const CustomElement: FC<Props> = ({ displayName, theme, externalProductId }) => {
  // Or get from URL
  const productIdFromUrl = new URLSearchParams(window.location.search).get('productId');
  const finalProductId = externalProductId || productIdFromUrl || 'DEFAULT-PRODUCT';

  // Use finalProductId when adding to cart
  const handleSubmit = () => {
    handleSubmitWithExternalProduct(finalProductId);
  };
};
*/

// OPTION 3: Product catalog selector
// Create a dropdown to select from your catalog:

/*
import { Dropdown } from '@wix/design-system';
import { searchExternalProducts } from './external-catalog.service';

const ProductSelector: FC = () => {
  const [products, setProducts] = useState<ExternalProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  useEffect(() => {
    // Load available products on mount
    searchExternalProducts('').then(setProducts);
  }, []);

  const productOptions = products.map(p => ({
    id: p.id,
    value: p.name,
  }));

  return (
    <FormField label="Select Product">
      <Dropdown
        options={productOptions}
        selectedId={selectedProductId}
        onSelect={(option) => setSelectedProductId(option?.id || '')}
      />
    </FormField>
  );
};
*/

// OPTION 4: Dynamic product loading based on page context
// If widget is on a product page, load that product's external ID:

/*
const getProductIdFromContext = async (): Promise<string> => {
  // Check if we're on a product page
  const pageUrl = window.location.pathname;
  
  if (pageUrl.includes('/product-page/')) {
    // Extract product slug or ID from URL
    const productSlug = pageUrl.split('/product-page/')[1];
    
    // Look up external ID from Wix product metadata
    // (Assuming you stored external ID in product custom fields)
    const { products } = await import('@wix/ecom');
    const product = await products.getProduct(productSlug);
    
    // Return external product ID from custom field
    return product.customFields?.['externalProductId'] || '';
  }
  
  return '';
};
*/

export {};
