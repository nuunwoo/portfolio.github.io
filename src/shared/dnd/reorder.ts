export const clampIndex = (index: number, max: number) => {
  if (max <= 0) return 0;
  if (index < 0) return 0;
  if (index > max) return max;
  return index;
};

export const reorderList = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (items.length === 0) return items;
  const safeFrom = clampIndex(fromIndex, items.length - 1);
  const safeTo = clampIndex(toIndex, items.length - 1);
  if (safeFrom === safeTo) return items;

  const next = items.slice();
  const [moved] = next.splice(safeFrom, 1);
  next.splice(safeTo, 0, moved);
  return next;
};
