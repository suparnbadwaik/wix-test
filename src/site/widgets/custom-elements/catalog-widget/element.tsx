import React, { type FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';

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
    <div className="catalog-widget-root">
      <header className="catalog-widget-header">
        <h2 className="catalog-widget-title">{displayName}</h2>
        <h3 className="catalog-widget-price">${formValues.amount}</h3>
        <p className="catalog-widget-description">
          Send a gift card to your loved ones with a personalized message.
        </p>
      </header>

      <div className="catalog-widget-content">
        <div className="catalog-widget-left">
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
        </div>

        <section className="catalog-widget-fields">
          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Amount</label>
            <div className="catalog-widget-amount-buttons">
              {quickAmountOptions.map((amountOption) => (
                <button
                  key={amountOption}
                  type="button"
                  className={`catalog-widget-btn ${formValues.amount === amountOption ? 'catalog-widget-btn-primary' : 'catalog-widget-btn-secondary'}`}
                  onClick={() => handleAmountChange(amountOption)}
                >
                  ${amountOption}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Quantity</label>
            <div className="catalog-widget-quantity-input">
              <button
                type="button"
                className="catalog-widget-quantity-btn"
                onClick={() => handleQuantityChange(Math.max(1, formValues.quantity - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="catalog-widget-quantity-value"
                value={formValues.quantity}
                onChange={(e) => handleQuantityChange(Math.max(1, Number(e.target.value) || 1))}
                min="1"
              />
              <button
                type="button"
                className="catalog-widget-quantity-btn"
                onClick={() => handleQuantityChange(formValues.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Recipient email *</label>
            <input
              type="email"
              className="catalog-widget-input"
              value={formValues.recipientEmail}
              onChange={(e) => handleFieldChange('recipientEmail', e.target.value)}
            />
          </div>

          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Recipient name *</label>
            <input
              type="text"
              className="catalog-widget-input"
              value={formValues.recipientName}
              onChange={(e) => handleFieldChange('recipientName', e.target.value)}
            />
          </div>
          
          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Sender email *</label>
            <input
              type="email"
              className="catalog-widget-input"
              value={formValues.senderEmail}
              onChange={(e) => handleFieldChange('senderEmail', e.target.value)}
            />
          </div>

          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Sender name *</label>
            <input
              type="text"
              className="catalog-widget-input"
              value={formValues.senderName}
              onChange={(e) => handleFieldChange('senderName', e.target.value)}
            />
          </div>

          <div className="catalog-widget-field">
            <label className="catalog-widget-label">Message</label>
            <textarea
              className="catalog-widget-textarea"
              value={formValues.senderName}
              onChange={(e) => handleFieldChange('senderName', e.target.value)}
              rows={4}
            />
          </div>

          <div className="catalog-widget-submit">
            <button 
              type="button"
              className="catalog-widget-btn catalog-widget-btn-primary catalog-widget-btn-full"
              onClick={handleSubmit}
            >
              Add to Cart
            </button>
          </div>
        </section>
      </div>
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
