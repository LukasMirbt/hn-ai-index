import ky from "ky";

export const client = ky.create({
  baseUrl: "https://news.ycombinator.com/",
  retry: {
    statusCodes: [403, 408, 413, 429, 500, 502, 503, 504],
    delay: () => 3000,
  },
});
