import AppIcon, { type AppIconName } from '../../../components/icons/app-icons';

type LaunchpadIconProps = {
  name: AppIconName;
  label: string;
};

const LaunchpadIcon = ({ name, label }: LaunchpadIconProps) => (
  <AppIcon name={name} size={92} alt={label} />
);

export default LaunchpadIcon;
