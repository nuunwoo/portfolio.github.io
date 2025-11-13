import type {CSSProperties, SVGProps} from 'react';
import {useSystemAppearance, type SystemAppearance} from '../../../../shared/hooks/useSystemAppearance';
import AppleLogoLight from './AppleLogoLight';

type AppleLogoMode = SystemAppearance | "system";

type AppleLogoProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  mode?: AppleLogoMode;
  width?: number | string;
  height?: number | string;
};

const AppleLogo = ({
  mode = "system",
  width,
  height,
  style,
  ...rest
}: AppleLogoProps) => {
  const systemAppearance = useSystemAppearance();
  const resolvedMode = mode === 'system' ? systemAppearance : mode;
  const mergedStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return <AppleLogoLight style={mergedStyle} {...rest} />;
};

export default AppleLogo;
