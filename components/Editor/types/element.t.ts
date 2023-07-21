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

export interface Element {
  id: string;
  type: string;
  content: ElementChild;
  option: unknown;
  style: unknown;
}
