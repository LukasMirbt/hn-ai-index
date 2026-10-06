const slopRegex = /\bslops?\b/i;

export function detectSlop(htmlText: string): boolean {
  return slopRegex.test(htmlText);
}
