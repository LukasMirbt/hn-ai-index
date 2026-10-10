import ky from "ky";

export const client = ky.create({
  baseUrl: "https://news.ycombinator.com/",
  retry: {
    delay: () => 1000,
  },
});
