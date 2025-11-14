import React, { useState } from 'react';
import {
  Page,
  Card,
  FormField,
  Input,
  Dropdown,
  Button,
  Box,
  Text,
  TagList,
  FileUpload,
  Cell,
  Layout,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { dashboard } from '@wix/dashboard';

interface ProductFormData {
  id: string;
  name: string;
  category: 'eGift' | 'Physical' | '';
  variants: string[];
  images: Array<{
    id: string;
    url: string;
    name: string;
  }>;
}

const Index = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    id: crypto.randomUUID(),
    name: '',
    category: '',
    variants: [],
    images: [],
  });

  const [variantInput, setVariantInput] = useState('');

  const categoryOptions = [
    { id: 'eGift', value: 'eGift' },
    { id: 'Physical', value: 'Physical' },
  ];

  const handleAddVariant = () => {
    if (variantInput.trim()) {
      setFormData({
        ...formData,
        variants: [...formData.variants, variantInput.trim()],
      });
      setVariantInput('');
    }
  };

  const handleVariantKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleAddVariant();
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = formData.images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img.id !== imageId),
    });
  };

  const handleSaveProduct = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Extract siteInfo which contains siteUrl and metaSiteId
      let siteId = 'not-found';
      let siteUrl = '';
      let editorUrl = '';
      let monerisAppId = '';
      
      const siteInfoParam = urlParams.get('siteInfo');
      
      if (siteInfoParam) {
        try {
          // siteInfo is URL-encoded, decode it first then parse as JSON
          const decodedSiteInfo = decodeURIComponent(siteInfoParam);
          const siteInfo = JSON.parse(decodedSiteInfo);
          siteUrl = siteInfo.siteUrl || '';
          editorUrl = siteInfo.editorUrl || '';
          
          // Extract metaSiteId from the siteUrl query parameter
          if (siteUrl) {
            const siteUrlObj = new URL(siteUrl);
            siteId = siteUrlObj.searchParams.get('metaSiteId') || siteId;
          }
          
          // Also try to get from editorUrl if siteUrl failed
          if (siteId === 'not-found' && editorUrl) {
            const editorUrlObj = new URL(editorUrl);
            siteId = editorUrlObj.searchParams.get('metaSiteId') || siteId;
          }
        } catch (e) {
          console.error('Error parsing siteInfo:', e);
          console.error('siteInfo value was:', siteInfoParam);
        }
      } else {
        console.log('No siteInfo parameter found in URL');
      }
      
      const instanceParam = urlParams.get('instance');
      if (instanceParam) {
        try {
          // The instance is a JWT token, decode the payload (middle part)
          const parts = instanceParam.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1]));
            monerisAppId = payload['appDefId'];
          }
        } catch (e) {
          console.error('Error decoding instance token:', e);
        }
      }
      
      const productData = {
        siteId: siteId,
        siteUrl: siteUrl,
        editorUrl: editorUrl,
        appId: monerisAppId,
        product: {
          id: formData.id,
          name: formData.name,
          category: formData.category,
          variants: formData.variants,
          images: formData.images.map(img => ({
            id: img.id,
            name: img.name,
            url: img.url,
          })),
        },
        timestamp: new Date().toISOString(),
      };

      // console.log('=== PRODUCT SAVE DATA ===');
      console.log('Site ID:', siteId);
      console.log('App ID:', productData.appId);
      console.log('Site URL:', siteUrl);
      console.log('Editor URL:', editorUrl);
      // FORM DATA
      console.log('Product ID:', formData.id);
      console.log('Product Name:', formData.name);
      console.log('Category:', formData.category);
      console.log('Variants:', formData.variants);
      console.log('Images Count:', formData.images.length);
      console.log('Images:', formData.images);
      // console.log('Full Payload:', JSON.stringify(productData, null, 2));
      // console.log('========================');

      dashboard.showToast({
        message: `Product "${formData.name}" saved successfully!`,
        type: 'success',
      });
      
      handleResetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      dashboard.showToast({
        message: 'Error saving product. Check console for details.',
        type: 'error',
      });
    }
  };

  const handleResetForm = () => {
    formData.images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });

    setFormData({
      id: crypto.randomUUID(),
      name: '',
      category: '',
      variants: [],
      images: [],
    });
    setVariantInput('');
  };

  const handleGenerateNewId = () => {
    setFormData({
      ...formData,
      id: crypto.randomUUID(),
    });
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page height="100vh">
        <Page.Header
          title="Product Manager"
          subtitle="Create and manage catalog products"
          actionsBar={
            <Box gap="SP2">
              <Button skin="light" onClick={handleResetForm}>
                Reset Form
              </Button>
              <Button 
                onClick={handleSaveProduct}
                disabled={!formData.name || !formData.category}
              >
                Save Product
              </Button>
            </Box>
          }
        />
        <Page.Content>
          <Layout>
            <Cell span={8}>
              <Card>
                <Card.Header title="Product Details" />
                <Card.Divider />
                <Card.Content>
                  <Layout gap="24px">
                    {/* Product ID */}
                    <Cell>
                      <FormField label="Product ID (GUID)" required>
                        <Box gap="SP2" verticalAlign="middle">
                          <Box width="100%">
                            <Input
                              value={formData.id}
                              onChange={(e) =>
                                setFormData({ ...formData, id: e.target.value })
                              }
                              placeholder="Enter or generate a GUID"
                              readOnly
                            />
                          </Box>
                          <Button
                            size="small"
                            skin="light"
                            prefixIcon={<Icons.Refresh />}
                            onClick={handleGenerateNewId}
                          >
                            Generate
                          </Button>
                        </Box>
                      </FormField>
                    </Cell>

                    {/* Product Name */}
                    <Cell>
                      <FormField label="Product Name" required>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter product name"
                        />
                      </FormField>
                    </Cell>

                    {/* Product Category */}
                    <Cell>
                      <FormField label="Product Category" required>
                        <Dropdown
                          placeholder="Select category"
                          options={categoryOptions}
                          selectedId={formData.category}
                          onSelect={(option) =>
                            setFormData({
                              ...formData,
                              category: option?.id as 'eGift' | 'Physical' | '',
                            })
                          }
                        />
                      </FormField>
                    </Cell>

                    {/* Variants */}
                    <Cell>
                      <FormField
                        label="Variants"
                        infoContent="Press Enter or Tab to add a variant"
                      >
                        <Box direction="vertical" gap="SP2">
                          <Input
                            value={variantInput}
                            onChange={(e) => setVariantInput(e.target.value)}
                            onKeyDown={handleVariantKeyDown}
                            placeholder="Enter variant value and press Enter/Tab"
                            suffix={
                              <Button
                                size="small"
                                skin="light"
                                onClick={handleAddVariant}
                                disabled={!variantInput.trim()}
                              >
                                Add
                              </Button>
                            }
                          />
                          {formData.variants.length > 0 && (
                            <Box marginTop="SP2">
                              <TagList
                                tags={formData.variants.map((variant, index) => ({
                                  id: String(index),
                                  children: variant,
                                }))}
                                onTagRemove={(tagId) =>
                                  handleRemoveVariant(Number(tagId))
                                }
                                actionButton={{
                                  label: 'Clear All',
                                  onClick: () =>
                                    setFormData({ ...formData, variants: [] }),
                                }}
                              />
                            </Box>
                          )}
                          {formData.variants.length === 0 && (
                            <Text size="small" secondary>
                              No variants added yet
                            </Text>
                          )}
                        </Box>
                      </FormField>
                    </Cell>

                    {/* Image Uploader */}
                    <Cell>
                      <FormField label="Product Images" infoContent="Upload multiple images">
                        <Box direction="vertical" gap="SP4">
                          <FileUpload
                            multiple
                            accept="image/*"
                            onChange={(files) => handleImageUpload(files)}
                          >
                            {({ openFileUploadDialog }) => (
                              <Box
                                direction="vertical"
                                align="center"
                                padding="SP4"
                                border="1px dashed"
                                borderRadius="8px"
                                backgroundColor="D70"
                              >
                                <Icons.Upload size="48px" />
                                <Text size="medium" weight="bold">
                                  Upload Images
                                </Text>
                                <Text size="small" secondary>
                                  Click or drag images here
                                </Text>
                                <Button
                                  size="small"
                                  skin="light"
                                  onClick={openFileUploadDialog}
                                  prefixIcon={<Icons.Add />}
                                >
                                  Choose Files
                                </Button>
                              </Box>
                            )}
                          </FileUpload>

                          {/* Display uploaded images */}
                          {formData.images.length > 0 && (
                            <Box direction="vertical" gap="SP2">
                              <Text weight="bold">Uploaded Images ({formData.images.length})</Text>
                              <Layout cols={4} gap="12px">
                                {formData.images.map((image) => (
                                  <Cell key={image.id}>
                                    <Box
                                      position="relative"
                                      border="1px solid"
                                      borderRadius="8px"
                                      overflow="hidden"
                                      height="120px"
                                    >
                                      <img
                                        src={image.url}
                                        alt={image.name}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                      <Box
                                        position="absolute"
                                        top="4px"
                                        right="4px"
                                      >
                                        <Button
                                          size="tiny"
                                          skin="destructive"
                                          onClick={() => handleRemoveImage(image.id)}
                                        >
                                          <Icons.Delete />
                                        </Button>
                                      </Box>
                                    </Box>
                                    <Text size="tiny" ellipsis>
                                      {image.name}
                                    </Text>
                                  </Cell>
                                ))}
                              </Layout>
                            </Box>
                          )}
                        </Box>
                      </FormField>
                    </Cell>

                    {/* Save Button */}
                    <Cell>
                      <Box gap="SP2" align="right">
                        <Button 
                          skin="light" 
                          onClick={handleResetForm}
                        >
                          Reset Form
                        </Button>
                        <Button 
                          onClick={handleSaveProduct}
                          
                          prefixIcon={<Icons.Confirm />}
                        >
                          Save Product
                        </Button>
                      </Box>
                    </Cell>
                  </Layout>
                </Card.Content>
              </Card>
            </Cell>

            {/* Preview Panel */}
            <Cell span={4}>
              <Card>
                <Card.Header title="Preview" />
                <Card.Divider />
                <Card.Content>
                  <Box direction="vertical" gap="SP3">
                    <Box direction="vertical" gap="SP1">
                      <Text size="small" weight="bold" secondary>
                        Product ID
                      </Text>
                      <Text size="small" ellipsis>
                        {formData.id || '(Not set)'}
                      </Text>
                    </Box>

                    <Box direction="vertical" gap="SP1">
                      <Text size="small" weight="bold" secondary>
                        Name
                      </Text>
                      <Text>{formData.name || '(Not set)'}</Text>
                    </Box>

                    <Box direction="vertical" gap="SP1">
                      <Text size="small" weight="bold" secondary>
                        Category
                      </Text>
                      <Text>{formData.category || '(Not set)'}</Text>
                    </Box>

                    <Box direction="vertical" gap="SP1">
                      <Text size="small" weight="bold" secondary>
                        Variants ({formData.variants.length})
                      </Text>
                      {formData.variants.length > 0 ? (
                        <Box direction="vertical" gap="SP1">
                          {formData.variants.map((variant, index) => (
                            <Text key={index} size="small">
                              • {variant}
                            </Text>
                          ))}
                        </Box>
                      ) : (
                        <Text size="small" secondary>
                          No variants
                        </Text>
                      )}
                    </Box>

                    <Box direction="vertical" gap="SP1">
                      <Text size="small" weight="bold" secondary>
                        Images ({formData.images.length})
                      </Text>
                      {formData.images.length > 0 ? (
                        formData.images.map((img) => (
                          <Text key={img.id} size="small" ellipsis>
                            • {img.name}
                          </Text>
                        ))
                      ) : (
                        <Text size="small" secondary>
                          No images
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Card.Content>
              </Card>
            </Cell>
          </Layout>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default Index;
