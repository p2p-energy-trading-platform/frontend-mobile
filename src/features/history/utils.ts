export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  /** 1-based index of the first / last item on this page (0 when empty). */
  from: number;
  to: number;
};

/** Slices a list into a page; the page number is clamped to the valid range. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);

  const startIndex = (current - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: pageItems,
    page: current,
    totalPages,
    total,
    from: total === 0 ? 0 : startIndex + 1,
    to: startIndex + pageItems.length,
  };
}
