export function formatAmount(value: number, decimals = 2) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatAed(value: number, decimals = 2) {
  return `AED ${formatAmount(value, decimals)}`;
}
