import {appIconNames, type AppIconName} from '.';

type AppIconCatalogItem = {
  key: string;
  label: string;
  icon: AppIconName;
};

const defaultDockItems = [
  {key: 'finder', label: 'Finder', icon: 'finder'},
  {key: 'launchpad', label: 'Launchpad', icon: 'launchpad'},
  {key: 'mail', label: 'Mail', icon: 'mail'},
  {key: 'calendar', label: 'Calendar', icon: 'calendar'},
  {key: 'notes', label: 'Notes', icon: 'notes'},
  {key: 'terminal', label: 'Terminal', icon: 'terminal'},
  {key: 'trash', label: 'Trash', icon: 'trash'},
] as const;

const dockAppIcons = defaultDockItems.filter(item => appIconNames.includes(item.icon as AppIconName)) as AppIconCatalogItem[];

const specialLabels = {
  'app-store': 'App Store',
  'apple-tv': 'Apple TV',
  'custom-app': 'Custom App',
  facetime: 'FaceTime',
  'find-my': 'Find My',
  garageband: 'GarageBand',
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
  'system-information': 'System Information',
  'swift-playgrounds': 'Swift Playgrounds',
  'quicktime-player': 'QuickTime Player',
  'voice-memos': 'Voice Memos',
  'voiceover-utility': 'VoiceOver Utility',
  'colorsync-utility': 'ColorSync Utility',
  xcode: 'Xcode',
} as const;

const launchpadLabelOverrides: Partial<Record<AppIconName, string>> = Object.fromEntries(
  Object.entries(specialLabels).filter(([key]) => appIconNames.includes(key as AppIconName)),
) as Partial<Record<AppIconName, string>>;

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
