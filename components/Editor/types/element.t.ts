export interface ElementChild {
  heading: string;
  body: {
    body1?: string;
    body2?: string;
    body3?: string;
  };
  image: string;
  link: {
    linkText: string;
    linkUrl: string;
  };
}

export type imageObjectFitType = "contain" | "cover" | "fill" | "unset";

export interface TStyle {
  objectFit?: imageObjectFitType;
}

export interface Element<T = ElementChild> {
  id: string;
  elementType: string;
  content: ElementChild | (ElementChild & Description<T>);
  option: unknown;
  style: TStyle;
}

export type Description<T> = {
  [key: string | number]: T;
};

export interface ElementWithDynamicType<T> extends Element {
  content: ElementChild & T;
}
