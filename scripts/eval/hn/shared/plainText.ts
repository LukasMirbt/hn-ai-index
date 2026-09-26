export const htmlToPlainText = (html: string): string => {
  const withoutTags = removeHtmlTags(html);
  const withoutEntities = removeHtmlEntities(withoutTags);
  const plainText = collapseWhitespace(withoutEntities);
  return plainText;
};

export const optionalHtmlToPlainText = (
  html?: string | null,
): string | null => {
  if (!html) return null;
  const plainText = htmlToPlainText(html);
  return plainText;
};

export const collapseWhitespace = (text: string): string => {
  const singleSpaced = text.replace(/\s+/g, " ");
  const trimmed = singleSpaced.trim();
  return trimmed;
};

const removeHtmlTags = (html: string) => html.replace(/<[^>]+>/g, " ");

const removeHtmlEntities = (html: string) => html.replace(/&\w+;/g, " ");
