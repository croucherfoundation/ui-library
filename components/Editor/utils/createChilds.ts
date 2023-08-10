import createCroucherChild from "../plugins/createCroucherChild";
import { Element } from "../types/element.t";
import { IMAGE_BLOCK, RICH_TEXT } from "./dragComponentTypes";
import { getPredefindElement } from "./generatePreElement";

function createChilds(type: string): Element<unknown> {
  const preDefinedElement = getPredefindElement(type);

  switch (type) {
    case IMAGE_BLOCK:
      return { ...getPredefindElement(type, true), elementType: type };
    case RICH_TEXT:
      return { ...preDefinedElement, elementType: type };

    default:
      return createCroucherChild(type) || preDefinedElement;
  }
}

export default createChilds;
