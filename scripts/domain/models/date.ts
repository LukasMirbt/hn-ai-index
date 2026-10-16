export function fromUnixTimestamp(timestamp: number): Date {
  const ms = timestamp * 1000;
  const date = new Date(ms);
  return date;
}
