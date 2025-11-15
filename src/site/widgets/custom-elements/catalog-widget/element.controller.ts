import { useState, useCallback } from 'react';
import type { GiftCardFormValues } from './element.entities';
import { DEFAULT_FORM_VALUES, IMAGE_OPTIONS, QUICK_AMOUNTS, QUANTITY_OPTIONS } from './element.constants';
import { fetchExternalProduct } from './external-catalog.service';
import { addProductViaBackend } from './wix-cart.service';

type FormField = keyof Omit<GiftCardFormValues, 'selectedImage' | 'quantity' | 'amount'>;

export const useGiftCardController = () => {
  const [formValues, setFormValues] = useState<GiftCardFormValues>(DEFAULT_FORM_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((imageUrl: string) => {
    setFormValues((prev) => ({ ...prev, selectedImage: imageUrl }));
  }, []);

  const handleAmountChange = useCallback((amount: number) => {
    setFormValues((prev) => ({ ...prev, amount }));
  }, []);

  const handleQuantityChange = useCallback((quantity: number) => {
    setFormValues((prev) => ({ ...prev, quantity }));
  }, []);

  const handleFieldChange = useCallback((field: FormField, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCustomAmountChange = useCallback((value: string) => {
    const numeric = Number(value.replace(/[^0-9.]/g, ''));
    setFormValues((prev) => ({ ...prev, amount: Number.isNaN(numeric) ? prev.amount : numeric }));
  }, []);

  /**
   * Add external product to cart
   * This demonstrates how to:
   * 1. Fetch product from external catalog using external product ID
   * 2. Add it to Wix cart with custom fields
   */
  const handleSubmitWithExternalProduct = useCallback(async (externalProductId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Fetch product details from your external API
      const product = await fetchExternalProduct(externalProductId);
      
      console.log('External product fetched:', product);

      // Step 2: Add to cart via backend (recommended approach)
      const result = await addProductViaBackend(externalProductId, formValues.quantity, {
        recipientName: formValues.recipientName,
        recipientEmail: formValues.recipientEmail,
        senderName: formValues.senderName,
        senderEmail: formValues.senderEmail,
        selectedImage: formValues.selectedImage,
        amount: formValues.amount.toString(),
      });

      if (result.success) {
        console.log('Product added to cart successfully:', result);
        alert(`✓ ${result.message}\nCart Item ID: ${result.cartItemId}`);
      } else {
        throw new Error(result.error || 'Failed to add product to cart');
      }
    } catch (err: any) {
      console.error('Error adding product to cart:', err);
      setError(err.message || 'Failed to add product to cart');
      alert(`✗ Error: ${err.message || 'Failed to add product to cart'}`);
    } finally {
      setIsLoading(false);
    }
  }, [formValues]);

  /**
   * Original submit handler (for demonstration)
   */
  const handleSubmit = useCallback(() => {
    console.log('Add to Cart payload', formValues);
    // Get external product id from the form which ever product is selected
    const externalProductId = '694e2edd-99df-4012-8dff-20b12d96d586';
    handleSubmitWithExternalProduct(externalProductId);
  }, [formValues, handleSubmitWithExternalProduct]);

  return {
    formValues,
    isLoading,
    error,
    handleImageSelect,
    handleAmountChange,
    handleQuantityChange,
    handleFieldChange,
    handleCustomAmountChange,
    handleSubmit,
    handleSubmitWithExternalProduct,
    imageOptions: IMAGE_OPTIONS,
    quickAmountOptions: QUICK_AMOUNTS,
    quantityOptions: QUANTITY_OPTIONS,
  };
};
