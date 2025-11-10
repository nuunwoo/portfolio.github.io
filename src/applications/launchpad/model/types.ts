import type { ReactNode } from 'react';

export type LaunchpadAppItem = {
  key: string;
  icon: ReactNode;
  iconSrc?: string;
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

export type LaunchpadPageBreakEntry = {
  id: string;
  type: 'page-break';
};

export type LaunchpadEntry = LaunchpadAppEntry | LaunchpadFolderEntry | LaunchpadPageBreakEntry;

export type LaunchpadLayoutSnapshot = {
  version: 2 | 3;
  items: LaunchpadEntry[];
};
