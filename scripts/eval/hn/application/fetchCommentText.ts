import { optionalHtmlToPlainText } from "../shared/plainText.js";
import type { HnGateway } from "./ports.js";

export const fetchCommentText = async (
  hn: HnGateway,
  id: number,
): Promise<string | null> => {
  const html = await hn.fetchCommentHtml(id);
  const plainText = optionalHtmlToPlainText(html);
  return plainText;
};
