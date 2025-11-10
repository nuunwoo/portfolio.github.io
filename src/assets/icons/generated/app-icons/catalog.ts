import {appIconNames, type AppIconName} from '.';

type AppIconCatalogItem = {
  key: string;
  label: string;
  icon: AppIconName;
};

const dockAppIcons: AppIconCatalogItem[] = [
  {key: 'finder', label: 'Finder', icon: 'finder'},
  {key: 'launchpad', label: 'Launchpad', icon: 'launchpad'},
  {key: 'mail', label: 'Mail', icon: 'mail'},
  {key: 'calendar', label: 'Calendar', icon: 'calendar'},
  {key: 'notes', label: 'Notes', icon: 'notes'},
  {key: 'terminal', label: 'Terminal', icon: 'terminal'},
  {key: 'trash', label: 'Trash', icon: 'trash'},
];

const launchpadLabelOverrides: Partial<Record<AppIconName, string>> = {
  'app-store': 'App Store',
  'apple-developer': 'Apple Developer',
  'apple-tv': 'Apple TV',
  'custom-app': 'Custom App',
  facetime: 'FaceTime',
  imovie: 'iMovie',
  keynote: 'Keynote',
  launchpad: 'Launchpad',
  mail: 'Mail',
  maps: 'Maps',
  music: 'Music',
  notes: 'Notes',
  pages: 'Pages',
  'photo-booth': 'Photo Booth',
  photos: 'Photos',
  podcasts: 'Podcasts',
  preview: 'Preview',
  safari: 'Safari',
  siri: 'Siri',
  terminal: 'Terminal',
  textedit: 'TextEdit',
  'system-settings': 'System Settings',
  'swift-playgrounds': 'Swift Playgrounds',
  'quicktime-player': 'QuickTime Player',
  xcode: 'Xcode',
};

const toTitleLabel = (name: AppIconName) =>
  launchpadLabelOverrides[name] ??
  name
    .split('-')
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');

const launchpadAppIcons: AppIconCatalogItem[] = appIconNames.map(iconName => ({
  key: iconName,
  label: toTitleLabel(iconName),
  icon: iconName,
}));

export type {AppIconCatalogItem};
export {dockAppIcons, launchpadAppIcons};
