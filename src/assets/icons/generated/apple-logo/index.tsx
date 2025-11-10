import type { ComponentType, CSSProperties, SVGProps } from "react";
import { useSystemAppearance, type SystemAppearance } from "../../../../shared/hooks/useSystemAppearance";
import AppleLogoDark from "./AppleLogoDark";
import AppleLogoLight from "./AppleLogoLight";

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
  const resolvedMode = mode === "system" ? systemAppearance : mode;
  const IconComponent: ComponentType<SVGProps<SVGSVGElement>> =
    (resolvedMode === "light" ? AppleLogoLight : AppleLogoDark) as ComponentType<SVGProps<SVGSVGElement>>;

  const mergedStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return <IconComponent style={mergedStyle} {...rest} />;
};

export default AppleLogo;
