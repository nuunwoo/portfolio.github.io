import type { ReactNode } from 'react';
import { PopoverSurface } from '../popover';
const ContextMenuSurface = ({ children }: { children: ReactNode }) => <PopoverSurface>{children}</PopoverSurface>;
export default ContextMenuSurface;
