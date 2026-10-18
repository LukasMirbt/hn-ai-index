export const directory = "./src/data/frontPage";

export function from(
  date: Temporal.PlainDate,
  { error }: { error: boolean },
): string {
  const year = date.year;
  const month = date.month;
  const day = date.day;
  const path = `${directory}/${year}/${month}/${error ? "error_" : ""}${day}.html`;
  return path;
}
