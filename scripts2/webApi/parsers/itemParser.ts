import { selectOne, selectAll } from "css-select";
import { parseDocument } from "htmlparser2";
import { render } from "dom-serializer";
import { Element } from "domhandler";

export type CommentData = {
  id: number;
  htmlText: string;
  indent: number;
};

export type ItemData = {
  comments: CommentData[];
};

export function parse(html: string): ItemData {
  const document = parseDocument(html);

  try {
    const commentTreeElement = selectOne(".comment-tree", document.children);
    const commentElements = selectAll(".athing.comtr", commentTreeElement);

    const comments = commentElements.map((element) => {
      const id = (element as Element).attribs.id;
      const commtextElement = selectOne(".commtext", element) as Element;
      const htmlText = commtextElement ? render(commtextElement.children) : "";
      const indentElement = selectOne(".ind", element) as Element;
      const indent = indentElement?.attribs.indent;

      return {
        id: parseInt(id, 10),
        htmlText,
        indent: parseInt(indent, 10),
      };
    });

    return { comments };
  } catch (e) {
    console.log(e);
    return { comments: [] };
  }
}

const slopRegex = /\bslops?\b/i;

export function detectSlop(htmlText: string): boolean {
  return slopRegex.test(htmlText);
}
