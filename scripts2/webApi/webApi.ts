import * as FrontPageParser from "./parsers/frontPageParser.ts";
import * as DateModel from "./models/date.ts";

const baseUrl = "https://news.ycombinator.com";

export async function fetchFrontPage({
  date,
}: {
  date: Date;
}): Promise<FrontPageParser.FrontPageData> {
  const day = DateModel.toYYYYMMDD(date);
  const response = await fetch(`${baseUrl}/front?day=${day}`);
  const html = await response.text();
  const page = FrontPageParser.parse(html);
  return page;
}
