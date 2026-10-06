import { selectOne } from "css-select";
import { render } from "dom-serializer";
import type { Element } from "domhandler";

export class CommentHtmlTextParser {
  parse(element: Element): string | undefined {
    const commtextElement = selectOne(".commtext", element);
    if (commtextElement === null) return undefined;
    return render(commtextElement.children);
  }
}
