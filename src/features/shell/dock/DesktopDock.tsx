import { useMemo } from "react";
import { OsDock, type DockItem } from "../../../design-system/components";
import AppIcon from "../../../components/icons/app-icons";
import { dockAppIcons } from "../../../components/icons/app-icons/catalog";
import styles from "./DesktopDock.module.css";

const dockItems: DockItem[] = dockAppIcons.map(item => ({
  key: item.key,
  label: item.label,
  glyph: <AppIcon name={item.icon} />,
  running: true,
  badge: item.key === "mail" ? "109" : undefined,
  separatorBefore: item.key === "trash",
}));

type DesktopDockProps = {
  isLaunchpadOpen: boolean;
  onLaunchpadToggle: () => void;
  onOtherItemClick?: (item: DockItem) => void;
};

const DesktopDock = ({ isLaunchpadOpen, onLaunchpadToggle, onOtherItemClick }: DesktopDockProps) => {
  const activeDockItemKey = useMemo(() => (isLaunchpadOpen ? "launchpad" : null), [isLaunchpadOpen]);

  const handleDockItemClick = (item: DockItem) => {
    if (item.key === "launchpad") {
      onLaunchpadToggle();
      return;
    }

    onOtherItemClick?.(item);
  };

  return (
    <div className={styles.root}>
      <OsDock items={dockItems} activeItemKey={activeDockItemKey} onItemClick={handleDockItemClick} />
    </div>
  );
};

export default DesktopDock;
