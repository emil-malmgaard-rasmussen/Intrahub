export function CalculateDifference(start: Date, end: Date) {
  const monthsDiff =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const yearsDiff = Math.floor(monthsDiff / 12);
  const monthsRemainder = monthsDiff % 12;
  return `${yearsDiff} år${
    monthsRemainder > 0 ? ` ${monthsRemainder} mdr` : ''
  }`;
}
