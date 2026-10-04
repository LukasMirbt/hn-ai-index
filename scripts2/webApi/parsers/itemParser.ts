import { selectOne, selectAll } from "css-select";
import { parseDocument } from "htmlparser2";
import { render } from "dom-serializer";
import { Element } from "domhandler";

export type Comment = {
  htmlText: string;
  indent: number;
};

export type ItemData = {
  comments: Comment[];
};

export function parse(html: string): ItemData {
  const document = parseDocument(html);

  const commentTreeElement = selectOne(".comment-tree", document.children);
  const commentElements = selectAll(".athing.comtr", commentTreeElement);

  const comments = commentElements.map((element) => {
    const commtextElement = selectOne(".commtext", element) as Element;
    const htmlText = commtextElement ? render(commtextElement.children) : "";
    const indentElement = selectOne(".ind", element) as Element;
    const indent = indentElement?.attribs.indent;

    return {
      htmlText,
      indent: parseInt(indent, 10),
    };
  });

  return { comments };
}
