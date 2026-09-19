export interface Post {
  id: number;
  title: string;
  domain: string | null;
  text: string | null;
  topComments: string[];
}

export interface Classification {
  result: boolean;
  reason: string;
}

export interface Classifier {
  name: string;
  classify(post: Post): Classification;
}
