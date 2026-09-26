export const domainOf = (url?: string): string | null => {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const domain = hostname.replace(/^www\./, "");
    return domain;
  } catch {
    return null;
  }
};
