import type { ReactNode } from 'react';

type LaunchpadBaseItem = {
  key: string;
  icon: ReactNode;
  iconSrc?: string;
  label: string;
};

export type LaunchpadAppItem = LaunchpadBaseItem & {
  itemType: 'app';
  appKey: string;
};

export type LaunchpadFolderItem = LaunchpadBaseItem & {
  itemType: 'folder';
  folderId: string;
  children: string[];
  previewChildren?: ReactNode[];
};

export type LaunchpadDisplayItem = LaunchpadAppItem | LaunchpadFolderItem;

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
