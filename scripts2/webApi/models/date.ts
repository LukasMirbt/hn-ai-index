export function toYYYYMMDD(date: Temporal.PlainDate) {
  return date.toString().split("T")[0];
}
