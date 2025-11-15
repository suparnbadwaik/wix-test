import type { GiftCardFormValues } from './element.entities';

export const IMAGE_OPTIONS: string[] = [
  'https://www.gstatic.com/webp/gallery3/1.sm.png',
  'https://pixabay.com/images/download/people-2944065_640.jpg',
  'https://www.gstatic.com/webp/gallery3/1.sm.png',
  'https://pixabay.com/images/download/people-2944065_640.jpg',
  'https://www.gstatic.com/webp/gallery3/1.sm.png'
];

export const DEFAULT_FORM_VALUES: GiftCardFormValues = {
  selectedImage: IMAGE_OPTIONS[0],
  amount: 10,
  quantity: 1,
  recipientName: '',
  recipientEmail: '',
  senderName: '',
  senderEmail: '',
  message: ''
};

export const QUICK_AMOUNTS = [10, 25, 50, 100];

export const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, index) => {
  const value = index + 1;
  return {
    id: value.toString(),
    value: value.toString(),
  };
});
