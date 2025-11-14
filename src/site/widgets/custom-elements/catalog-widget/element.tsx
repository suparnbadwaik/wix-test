import React, { type FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import {
  WixDesignSystemProvider,
  Heading,
  Text,
  Input,
  Dropdown,
  Button,
  Box,
  FormField,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

import './element.css';

import { useGiftCardController } from './element.controller';

interface Props {
  displayName?: string;
  theme?: string;
}

const CustomElement: FC<Props> = ({
  displayName = 'Gift Card',
  theme = 'classic',
}) => {
  // Debug log
  console.log('Widget props:', { displayName, theme });

  // Dynamically load theme CSS
  useEffect(() => {
    const styleId = 'catalog-widget-theme-style';
    
    // Remove existing theme style
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Import and inject the theme CSS
    import(`./themes/${theme}.css`).then(() => {
      console.log(`Theme ${theme} loaded`);
    }).catch(err => {
      console.error(`Failed to load theme ${theme}:`, err);
    });
  }, [theme]);

  const {
    formValues,
    handleImageSelect,
    handleAmountChange,
    handleQuantityChange,
    handleFieldChange,
    handleCustomAmountChange,
    handleSubmit,
    imageOptions,
    quickAmountOptions,
    quantityOptions,
  } = useGiftCardController();

  return (
    <div>
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <div className="catalog-widget-root">
        <header className="catalog-widget-header">
          <Heading appearance="H2">{displayName}</Heading>
          <Text secondary size="small">
            Personalize your gift card before adding it to cart.
          </Text>
        </header>

        <div className="catalog-widget-preview">
          <img src={formValues.selectedImage} alt="Selected gift card" />
        </div>

        <div className="catalog-widget-thumbnails">
          {imageOptions.map((imageUrl) => {
            const isActive = imageUrl === formValues.selectedImage;
            return (
              <button
                key={imageUrl}
                type="button"
                className={`catalog-widget-thumbnail-button${
                  isActive ? ' catalog-widget-thumbnail-active' : ''
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              >
                <img src={imageUrl} alt="Gift card option" />
              </button>
            );
          })}
        </div>

        <section className="catalog-widget-fields">
          <FormField label="Amount & Quantity">
            <div className="catalog-widget-amount-row">
              <Input
                value={formValues.amount.toString()}
                onChange={(event) => handleCustomAmountChange(event.target.value)}
                prefix={<Text size="tiny">$</Text>}
                size="medium"
                aria-label="Custom amount"
                className="catalog-widget-amount-input"
              />
              <div className="catalog-widget-amount-buttons">
                {quickAmountOptions.map((amountOption) => (
                  <Button
                    key={amountOption}
                    size="small"
                    priority={formValues.amount === amountOption ? 'primary' : 'secondary'}
                    onClick={() => handleAmountChange(amountOption)}
                  >
                    ${amountOption}
                  </Button>
                ))}
              </div>
              <Dropdown
                size="small"
                selectedId={formValues.quantity.toString()}
                options={quantityOptions}
                onSelect={(option) => {
                  if (option?.id) {
                    handleQuantityChange(Number(option.id));
                  }
                }}
                placeholder="Qty"
                className="catalog-widget-quantity-dropdown"
              />
            </div>
          </FormField>

          <div>
            <Heading appearance="H4">Recipient Details</Heading>
            <div className="catalog-widget-two-column">
              <FormField label="Recipient Name">
                <Input
                  value={formValues.recipientName}
                  onChange={(event) => handleFieldChange('recipientName', event.target.value)}
                  placeholder="Recipient's full name"
                />
              </FormField>
              <FormField label="Recipient Email">
                <Input
                  type="email"
                  value={formValues.recipientEmail}
                  onChange={(event) => handleFieldChange('recipientEmail', event.target.value)}
                  placeholder="name@example.com"
                />
              </FormField>
            </div>
          </div>

          <div>
            <Heading appearance="H4">Sender Details</Heading>
            <div className="catalog-widget-two-column">
              <FormField label="Sender Name">
                <Input
                  value={formValues.senderName}
                  onChange={(event) => handleFieldChange('senderName', event.target.value)}
                  placeholder="Your full name"
                />
              </FormField>
              <FormField label="Sender Email">
                <Input
                  type="email"
                  value={formValues.senderEmail}
                  onChange={(event) => handleFieldChange('senderEmail', event.target.value)}
                  placeholder="you@example.com"
                />
              </FormField>
            </div>
            <Text className="catalog-widget-helper">
              We&apos;ll email the digital gift card to the recipient and send you a copy.
            </Text>
          </div>

          <Box className="catalog-widget-submit">
            <Button size="medium" priority="primary" fullWidth onClick={handleSubmit}>
              Add to Cart
            </Button>
          </Box>
        </section>
        </div>
      </WixDesignSystemProvider>
    </div>
  );
};

const customElement = reactToWebComponent(
  CustomElement,
  React,
  ReactDOM as any,
  {
    props: {
      displayName: 'string',
      theme: 'string',
    },
  }
);

export default customElement;
