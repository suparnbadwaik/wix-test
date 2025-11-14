import React, { type FC, useState, useEffect } from 'react';
import { dashboard } from '@wix/dashboard';
import {
  Page,
  Card,
  Table,
  TableToolbar,
  Button,
  Badge,
  WixDesignSystemProvider,
  Box,
  Text,
  Layout,
  Cell
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { catalogItems } from '../../backend/catalog-data';

const CatalogManager: FC = () => {
  const [items, setItems] = useState(Object.values(catalogItems));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns = [
    {
      title: 'ID',
      render: (row: any) => row.id,
      width: '120px',
    },
    {
      title: 'Name',
      render: (row: any) => (
        <Box direction="vertical" gap="2px">
          <Text weight="bold">{row.name}</Text>
          <Text size="small" secondary>
            {row.description}
          </Text>
        </Box>
      ),
      width: '35%',
    },
    {
      title: 'Type',
      render: (row: any) => (
        <Badge skin={
          row.type === 'PHYSICAL' ? 'general' :
          row.type === 'DIGITAL' ? 'success' :
          row.type === 'SERVICE' ? 'warning' :
          'standard'
        }>
          {row.type}
        </Badge>
      ),
      width: '100px',
    },
    {
      title: 'Price',
      render: (row: any) => (
        <Box direction="vertical" gap="2px">
          <Text>${row.price}</Text>
          {row.fullPrice && row.fullPrice !== row.price && (
            <Text size="small" secondary light>
              <s>${row.fullPrice}</s>
            </Text>
          )}
        </Box>
      ),
      width: '100px',
    },
    {
      title: 'Inventory',
      render: (row: any) => (
        <Badge
          skin={
            row.inventory > 50 ? 'success' :
            row.inventory > 10 ? 'warning' :
            row.inventory > 0 ? 'danger' :
            'neutralLight'
          }
        >
          {row.inventory} in stock
        </Badge>
      ),
      width: '120px',
    },
    {
      title: 'Variants',
      render: (row: any) => (
        <Text>
          {row.variants ? Object.keys(row.variants).length : 0}
        </Text>
      ),
      width: '80px',
    },
  ];

  const handleAddToCatalog = () => {
    dashboard.showToast({
      message: 'Add new item feature - Connect to your backend API',
      type: 'success',
    });
  };

  const handleRefresh = () => {
    setItems(Object.values(catalogItems));
    dashboard.showToast({
      message: 'Catalog refreshed successfully',
      type: 'success',
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'catalog-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    dashboard.showToast({
      message: 'Catalog exported successfully',
      type: 'success',
    });
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page height="100vh">
        <Page.Header
          title="Catalog Service Plugin Manager"
          subtitle="Manage your external catalog items integrated with Wix eCommerce"
          actionsBar={
            <Box gap="12px">
              <Button
                size="small"
                priority="secondary"
                onClick={handleRefresh}
                prefixIcon={<Icons.Refresh />}
              >
                Refresh
              </Button>
              <Button
                size="small"
                priority="secondary"
                onClick={handleExport}
                prefixIcon={<Icons.Download />}
              >
                Export
              </Button>
              <Button
                size="small"
                onClick={handleAddToCatalog}
                prefixIcon={<Icons.Add />}
              >
                Add Item
              </Button>
            </Box>
          }
        />
        
        <Page.Content>
          <Layout>
            <Cell span={12}>
              <Box direction="vertical" gap="24px">
                {/* Stats Cards */}
                <Layout>
                  <Cell span={3}>
                    <Card>
                      <Card.Content>
                        <Box direction="vertical" gap="8px" align="center">
                          <Text size="tiny" secondary>
                            Total Items
                          </Text>
                          <Text size="medium" weight="bold">
                            {items.length}
                          </Text>
                        </Box>
                      </Card.Content>
                    </Card>
                  </Cell>
                  <Cell span={3}>
                    <Card>
                      <Card.Content>
                        <Box direction="vertical" gap="8px" align="center">
                          <Text size="tiny" secondary>
                            Physical Products
                          </Text>
                          <Text size="medium" weight="bold">
                            {items.filter(i => i.type === 'PHYSICAL').length}
                          </Text>
                        </Box>
                      </Card.Content>
                    </Card>
                  </Cell>
                  <Cell span={3}>
                    <Card>
                      <Card.Content>
                        <Box direction="vertical" gap="8px" align="center">
                          <Text size="tiny" secondary>
                            Digital Products
                          </Text>
                          <Text size="medium" weight="bold">
                            {items.filter(i => i.type === 'DIGITAL').length}
                          </Text>
                        </Box>
                      </Card.Content>
                    </Card>
                  </Cell>
                  <Cell span={3}>
                    <Card>
                      <Card.Content>
                        <Box direction="vertical" gap="8px" align="center">
                          <Text size="tiny" secondary>
                            Total Inventory
                          </Text>
                          <Text size="medium" weight="bold">
                            {items.reduce((sum, i) => sum + i.inventory, 0)}
                          </Text>
                        </Box>
                      </Card.Content>
                    </Card>
                  </Cell>
                </Layout>

                {/* Catalog Table */}
                <Card>
                  <TableToolbar>
                    <TableToolbar.Title>Catalog Items</TableToolbar.Title>
                  </TableToolbar>
                  <Table
                    data={items}
                    columns={columns}
                    showSelection
                    selectedIds={selectedIds}
                    onSelectionChanged={(ids) => setSelectedIds(ids as string[] || [])}
                  >
                    <Table.Content />
                  </Table>
                </Card>

                {/* Integration Instructions */}
                <Card>
                  <Card.Header title="How to Use This Catalog Service Plugin" />
                  <Card.Content>
                    <Box direction="vertical" gap="16px">
                      <Text>
                        <strong>Step 1:</strong> Configure the plugin in your Wix App dashboard under Extensions → Ecom Catalog
                      </Text>
                      <Text>
                        <strong>Step 2:</strong> Your catalog items are now available to Wix eCommerce. When customers add items to cart, Wix will call your getCatalogItems handler.
                      </Text>
                      <Text>
                        <strong>Step 3:</strong> To add items to cart programmatically, use the cart API with your app ID and catalog item IDs.
                      </Text>
                      <Box marginTop="12px">
                        <Text secondary size="small">
                          App ID: Get from{' '}
                          <a 
                            href="https://dev.wix.com/dc3/my-apps/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#3899EC', textDecoration: 'underline' }}
                          >
                            Wix App Dashboard
                          </a>
                        </Text>
                      </Box>
                    </Box>
                  </Card.Content>
                </Card>

                {/* Example Code Card */}
                <Card>
                  <Card.Header title="Example: Add Item to Cart" />
                  <Card.Content>
                    <Box
                      padding="16px"
                      backgroundColor="#f0f4f7"
                      borderRadius="8px"
                    >
                      <pre style={{ 
                        margin: 0, 
                        fontFamily: 'monospace', 
                        fontSize: '12px',
                        overflow: 'auto'
                      }}>
{`import { cart } from '@wix/ecom/frontend';

await cart.addToCurrentCart({
  lineItems: [{
    quantity: 1,
    catalogReference: {
      appId: "YOUR_APP_ID",
      catalogItemId: "item_001",
      options: {
        color: "Red",
        size: "M"
      }
    }
  }]
});`}
                      </pre>
                    </Box>
                  </Card.Content>
                </Card>
              </Box>
            </Cell>
          </Layout>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default CatalogManager;
