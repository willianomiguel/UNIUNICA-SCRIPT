import { defineSettingsFrontComponent } from 'integracore-sdk/define';
import { DesktopSettings } from 'src/components/DesktopSettings';

export default defineSettingsFrontComponent({
  universalIdentifier: 'c7f85fb5-a198-4e80-9ee1-53d80cc68761',
  name: 'desktop-settings',
  description: 'Download IntegraCore for macOS and configure desktop recording.',
  component: DesktopSettings,
});
