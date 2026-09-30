import * as api from "../../api/hnApi.ts";

export type Comment = {
  test: string;
};

export function from(item: api.Comment): Comment {
  return {
    test: "",
  };
}
