import AppIcon, { type AppIconName } from '../../../../assets/icons/generated/app-icons';

type LaunchpadIconProps = {
  name: AppIconName;
  label: string;
};

const LaunchpadIcon = ({ name, label }: LaunchpadIconProps) => (
  <AppIcon name={name} size={98} alt={label} loading="eager" decoding="sync" />
);

export default LaunchpadIcon;
