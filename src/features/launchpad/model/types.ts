import type { ReactNode } from 'react';

export type LaunchpadAppItem = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type LaunchpadLayoutSnapshot = {
  version: 1;
  orderedKeys: string[];
  groups: Array<{ id: string; key: string; title: string; children: string[] }>;
};
