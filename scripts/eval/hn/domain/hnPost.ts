export interface HnPost {
  id: number;
  title: string;
  url: string | null;
  domain: string | null;
  text: string | null;
  kids: number[];
}
