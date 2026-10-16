import * as parser from "../../webApi/parsers/frontPageItemParser.ts";

export type FrontPageItem = {
  id: number;
};

export function from(data: parser.FrontPageItemData) {
  return {
    id: parseInt(data.id, 10),
  };
}
