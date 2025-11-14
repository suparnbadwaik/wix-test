import { useState, useCallback } from 'react';
import type { GiftCardFormValues } from './element.entities';
import { DEFAULT_FORM_VALUES, IMAGE_OPTIONS, QUICK_AMOUNTS, QUANTITY_OPTIONS } from './element.constants';

type FormField = keyof Omit<GiftCardFormValues, 'selectedImage' | 'quantity' | 'amount'>;

export const useGiftCardController = () => {
  const [formValues, setFormValues] = useState<GiftCardFormValues>(DEFAULT_FORM_VALUES);

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

  const handleSubmit = useCallback(() => {
    console.log('Add to Cart payload', formValues);
  }, [formValues]);

  return {
    formValues,
    handleImageSelect,
    handleAmountChange,
    handleQuantityChange,
    handleFieldChange,
    handleCustomAmountChange,
    handleSubmit,
    imageOptions: IMAGE_OPTIONS,
    quickAmountOptions: QUICK_AMOUNTS,
    quantityOptions: QUANTITY_OPTIONS,
  };
};
