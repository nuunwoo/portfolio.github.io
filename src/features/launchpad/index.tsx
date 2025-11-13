import {useMemo} from 'react';
import AppIcon from '../../assets/icons/generated/app-icons';
import {getAppIconSrc} from '../../assets/icons/generated/app-icons';
import {launchpadAppIcons} from '../../assets/icons/generated/app-icons/catalog';
import {useAppStore} from '../../shared/store/app-store';
import {useDockItems} from '../dock';
import {LAUNCHPAD_PAGE_SIZE} from './model/constants';
import type {LaunchpadDisplayItem} from './model/types';
import {useLaunchpadLayout} from './model/useLaunchpadLayout';
import {LaunchpadIcon, LaunchpadMotion} from './ui';

const Launchpad = () => {
  const isLaunchpadOpen = useAppStore(state => state.isLaunchpadOpen);
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);
  const {
    addDockItem,
    dockDropPreviewIndex,
    isDockAtMaxItemCount,
    setDockDropPointerPosition,
    setDockDropPreviewIndex,
    setDockDropTargetActive,
  } = useDockItems();

  const launchpadSourceApps = useMemo(
    () =>
      launchpadAppIcons.map(item => ({
        key: item.key,
        appKey: item.key,
        itemType: 'app' as const,
        icon: <LaunchpadIcon name={item.icon} label={item.label} />,
        iconSrc: getAppIconSrc(item.icon),
        label: item.label,
      })),
    [],
  );

  const {layoutItems, moveApp, moveAppToNewPage, moveAppToPageEnd} = useLaunchpadLayout(launchpadSourceApps);

  const {launchpadApps, launchpadPagedApps} = useMemo(() => {
    const appByKey = new Map(launchpadSourceApps.map(app => [app.appKey, app] as const));
    const orderedItems: LaunchpadDisplayItem[] = [];
    const pagedItems: LaunchpadDisplayItem[][] = [[]];

    layoutItems.forEach(item => {
      if (item.type === 'page-break') {
        if (pagedItems.at(-1)?.length === 0) {
          return;
        }

        pagedItems.push([]);
        return;
      }

      let currentPage = pagedItems.at(-1);
      if (!currentPage) {
        pagedItems.push([]);
        currentPage = pagedItems.at(-1);
      }

      if ((currentPage?.length ?? 0) >= LAUNCHPAD_PAGE_SIZE) {
        pagedItems.push([]);
        currentPage = pagedItems.at(-1);
      }

      if (item.type === 'app') {
        const sourceItem = appByKey.get(item.appKey);
        if (!sourceItem) {
          return;
        }

        orderedItems.push(sourceItem);
        currentPage?.push(sourceItem);
        return;
      }

      const folderItem = {
        key: item.id,
        folderId: item.id,
        itemType: 'folder' as const,
        children: item.children,
        previewChildren: item.children
          .slice(0, 9)
          .map(childKey => {
            const childItem = appByKey.get(childKey);
            if (!childItem) {
              return null;
            }

            return (
              <AppIcon
                key={childKey}
                name={childItem.appKey as Parameters<typeof AppIcon>[0]['name']}
                size={18}
                alt={childItem.label}
                loading="eager"
                decoding="sync"
              />
            );
          })
          .filter(Boolean),
        icon: <LaunchpadIcon name="folder" label={item.title} />,
        iconSrc: getAppIconSrc('folder'),
        label: item.title,
      };

      orderedItems.push(folderItem);
      currentPage?.push(folderItem);
    });

    if (pagedItems.length > 1 && pagedItems.at(-1)?.length === 0) {
      pagedItems.pop();
    }

    return {
      launchpadApps: orderedItems,
      launchpadPagedApps: pagedItems.length > 0 ? pagedItems : [[]],
    };
  }, [layoutItems, launchpadSourceApps]);

  const handleCopyAppToDock = (appKey: string) => {
    if (isDockAtMaxItemCount) {
      return;
    }

    addDockItem(appKey, dockDropPreviewIndex);
    setDockDropPointerPosition(null);
    setDockDropPreviewIndex(null);
    setDockDropTargetActive(false);
  };

  const handleDockDragHoverChange = (clientX: number | null, clientY: number | null) => {
    if (isDockAtMaxItemCount) {
      setDockDropTargetActive(false);
      setDockDropPointerPosition(null);
      setDockDropPreviewIndex(null);
      return;
    }

    const isActive = clientX !== null && clientY !== null;
    setDockDropTargetActive(isActive);
    setDockDropPointerPosition(isActive ? {x: clientX, y: clientY} : null);
    if (!isActive) {
      setDockDropPreviewIndex(null);
    }
  };

  return (
    <LaunchpadMotion
      isOpen={isLaunchpadOpen}
      apps={launchpadApps}
      pagedApps={launchpadPagedApps}
      onMoveApp={moveApp}
      onMoveAppToNewPage={moveAppToNewPage}
      onMoveAppToPageEnd={moveAppToPageEnd}
      onCopyAppToDock={handleCopyAppToDock}
      onDockDragHoverChange={handleDockDragHoverChange}
      onClose={closeLaunchpad}
    />
  );
};

export default Launchpad;
export {Launchpad as LaunchpadFeature};
export {LaunchpadSurface, LaunchpadIcon, LaunchpadMotion, LaunchpadPagination, LaunchpadSearchBar} from './ui';
export {useLaunchpadLayout} from './model/useLaunchpadLayout';
export {filterApps, paginateApps} from './model/layout';
export {LAUNCHPAD_PAGE_SIZE} from './model/constants';
export type {LaunchpadAppItem, LaunchpadDisplayItem, LaunchpadEntry, LaunchpadFolderEntry} from './model/types';
export type {LaunchpadPhase} from './ui';
