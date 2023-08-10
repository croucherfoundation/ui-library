import { CroucherImageCard } from "../types/croucher.t";
import { v4 as uuidv4 } from "uuid";
import { Element } from "../types/element.t";
import {
  CROUCHER_6_6,
  CROUCHER_3_3_6,
  CROUCHER_IMG_CARD_CAROUSEL,
  CROUCHER_REPORT_CARD,
  CROUCHER_SUBSCRIBE,
} from "../utils/dragComponentTypes";
import {
  preDefindContent,
  getPredefindElement,
  DEFAULT_IMAGE,
} from "../utils/generatePreElement";

export const makeCroucherCarousels = (len = 3): CroucherImageCard[] => {
  const emptyCard = {
    heading: "",
    content: "",
    image: DEFAULT_IMAGE,
    image_id: "",
    body: {},
    link: {
      linkText: "download",
      linkUrl: "",
    },
  };
  return Array.from({ length: len }, () => ({
    ...emptyCard,
    id: uuidv4(),
    style: { objectFit: "cover" },
  }));
};

function createCroucherChild(type: string): Element<unknown> {
  switch (type) {
    case CROUCHER_6_6:
      return getPredefindElement(CROUCHER_6_6, true);

    case CROUCHER_3_3_6:
      return getPredefindElement(CROUCHER_3_3_6, true);

    case CROUCHER_IMG_CARD_CAROUSEL:
      return {
        ...getPredefindElement(CROUCHER_IMG_CARD_CAROUSEL),
        style: { objectFit: "cover" },
        content: {
          ...preDefindContent,
          // Croucher Image Data
          list: makeCroucherCarousels(1),
        },
      };

    case CROUCHER_REPORT_CARD:
      return {
        ...getPredefindElement(CROUCHER_REPORT_CARD),
        style: { objectFit: "cover" },
        content: {
          ...preDefindContent,
          link: {
            linkText: "All reports",
            linkUrl: "",
          },
          // Croucher Image Data
          list: makeCroucherCarousels(3),
        },
      };

    case CROUCHER_SUBSCRIBE:
      return {
        ...getPredefindElement(CROUCHER_SUBSCRIBE),
        content: {
          ...preDefindContent,
          link: {
            linkText: "Subscribe",
            linkUrl: "",
          },
        },
      };

    default:
      return getPredefindElement(type);
  }
}

export default createCroucherChild;
