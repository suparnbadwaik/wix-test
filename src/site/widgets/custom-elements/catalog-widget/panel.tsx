import React, { type FC, useState, useEffect, useCallback } from 'react';
import { widget } from '@wix/editor';
import {
  SidePanel,
  WixDesignSystemProvider,
  Input,
  FormField,
  SectionHelper,
  Dropdown,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

const SITE_WIDGETS_DOCS = 'https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/site-extensions/site-widgets/site-widget-extension-files-and-code';

const Panel: FC = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [theme, setTheme] = useState<string>('classic');

  const themeOptions = [
    { id: 'classic', value: 'Classic Theme' },
    { id: 'modern', value: 'Modern Theme' },
    { id: 'minimalist', value: 'Minimalist Theme' },
  ];

  useEffect(() => {
    widget.getProp('display-name')
      .then(displayName => setDisplayName(displayName || `Your Widget's Title`))
      .catch(error => console.error('Failed to fetch display-name:', error));

    widget.getProp('theme')
      .then(themeValue => setTheme(themeValue || 'classic'))
      .catch(error => console.error('Failed to fetch theme:', error));
  }, [setDisplayName, setTheme]);

  const handleDisplayNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = event.target.value;
    setDisplayName(newDisplayName);
    widget.setProp('display-name', newDisplayName);
  }, [setDisplayName]);

  const handleThemeChange = useCallback((option: any) => {
    if (option?.id) {
      setTheme(option.id);
      widget.setProp('theme', option.id);
    }
  }, [setTheme]);

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          <SidePanel.Field>
            <FormField label="Display Name">
              <Input
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                aria-label="Display Name"
              />
            </FormField>
          </SidePanel.Field>
          
          <SidePanel.Field>
            <FormField label="Theme">
              <Dropdown
                placeholder="Select theme"
                options={themeOptions}
                selectedId={theme}
                onSelect={handleThemeChange}
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Content>
        <SidePanel.Footer noPadding>
          <SectionHelper fullWidth appearance="success" border="topBottom">
            Learn more about <a href={SITE_WIDGETS_DOCS} target="_blank" rel="noopener noreferrer" title="Site Widget docs">Site Widgets</a>
          </SectionHelper>
        </SidePanel.Footer>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
