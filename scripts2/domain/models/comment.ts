import * as api from "../../firebaseApi/firebaseApi.ts";
import * as DateModel from "./date.ts";

export type Comment = {
  by: string;
  id: number;
  kids: number[];
  parent: number;
  text: string;
  time: Date;
};

export function from(item: api.Comment): Comment {
  return {
    by: item.by,
    id: item.id,
    kids: item.kids ?? [],
    parent: item.parent,
    text: item.text,
    time: DateModel.fromUnixTimestamp(item.time),
  };
}
