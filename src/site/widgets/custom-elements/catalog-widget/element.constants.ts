import type { GiftCardFormValues } from './element.entities';

export const IMAGE_OPTIONS: string[] = [
  'https://static.wixstatic.com/media/84770f_c5d7fb7c487a46f596937c781e52e632~mv2.jpg',
  'https://static.wixstatic.com/media/84770f_536cfd6b471a49f494c439da047ba2bc~mv2.jpg',
  'https://static.wixstatic.com/media/84770f_bf1defdd53d0405a9f70b581aba7735d~mv2.jpg',
  'https://static.wixstatic.com/media/84770f_8f31ccd89f2f4746a8a7a8e7d75ba2c9~mv2.jpg',
  'https://static.wixstatic.com/media/84770f_0b119ce78ead4ff9b66f5648432c05be~mv2.jpg',
];

export const DEFAULT_FORM_VALUES: GiftCardFormValues = {
  selectedImage: IMAGE_OPTIONS[0],
  amount: 25,
  quantity: 1,
  recipientName: '',
  recipientEmail: '',
  senderName: '',
  senderEmail: '',
};

export const QUICK_AMOUNTS = [25, 50];

export const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, index) => {
  const value = index + 1;
  return {
    id: value.toString(),
    value: value.toString(),
  };
});
