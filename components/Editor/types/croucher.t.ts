import { ElementChild, imageObjectFitType } from "./element.t";

export interface CroucherImageCard extends ElementChild {
  id: string;
  content: string;
  image: string;
  image_id: string;
  style: {
    objectFit?: imageObjectFitType;
  };
}

export interface CroucherReportCard extends ElementChild {
  id: string;
  content: string;
  image: string;
  image_id: string;
  style?: {
    objectFit?: imageObjectFitType;
  };
}

export interface CroucherImageCardList {
  list: CroucherImageCard[];
}

export interface CroucherReportCardList {
  list: CroucherReportCard[];
}

export interface ButtonLinkFormValues {
  buttonUrl: string;
  buttonText: string;
}

export interface ColProps {
  className?: string;
}

export type selectedCroucherElementType = "croucherImageBlock";
