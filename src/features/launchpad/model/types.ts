import type { ReactNode } from 'react';

export type LaunchpadAppItem = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type LaunchpadAppEntry = {
  id: string;
  type: 'app';
  appKey: string;
};

export type LaunchpadFolderEntry = {
  id: string;
  type: 'folder';
  title: string;
  children: string[];
};

export type LaunchpadEntry = LaunchpadAppEntry | LaunchpadFolderEntry;

export type LaunchpadLayoutSnapshot = {
  version: 2;
  items: LaunchpadEntry[];
};
